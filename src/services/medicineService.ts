import { supabase } from '@/integrations/supabase/client';
import type { Medicine } from '@/types';

export interface MedicineMatch {
  medicine: Medicine;
  confidence: number;
  rxnormMatch: boolean;
}

export const searchMedicinesInDatabase = async (extractedMedicines: string[]): Promise<MedicineMatch[]> => {
  try {
    console.log('Searching for medicines with enhanced matching:', extractedMedicines);
    
    // Fetch all medicines from database
    const { data: medicines, error } = await supabase
      .from('medicines')
      .select('*')
      .eq('in_stock', true);

    if (error) {
      console.error('Error fetching medicines:', error);
      return [];
    }

    console.log('Database medicines count:', medicines?.length || 0);

    if (!medicines || medicines.length === 0) {
      console.log('No medicines found in database');
      return [];
    }

    const matches: MedicineMatch[] = [];
    const usedMedicineIds = new Set<string>();

    for (const extractedMedicine of extractedMedicines) {
      console.log('Processing extracted medicine:', extractedMedicine);
      
      // Enhanced matching with multiple strategies
      const bestMatch = findEnhancedDatabaseMatch(extractedMedicine, medicines, usedMedicineIds);
      
      if (bestMatch) {
        console.log('Found enhanced match:', bestMatch);
        matches.push(bestMatch);
        usedMedicineIds.add(bestMatch.medicine.id);
      } else {
        console.log('No match found for:', extractedMedicine);
      }
    }

    console.log('Total enhanced matches found:', matches.length);
    return matches;
  } catch (error) {
    console.error('Error in enhanced medicine search:', error);
    return [];
  }
};

const findEnhancedDatabaseMatch = (
  extractedName: string, 
  medicines: any[], 
  usedIds: Set<string>
): MedicineMatch | null => {
  const extractedLower = cleanMedicineName(extractedName);
  let bestMatch: MedicineMatch | null = null;
  let highestScore = 0;

  console.log('Finding enhanced match for cleaned name:', extractedLower);

  for (const medicine of medicines) {
    if (usedIds.has(medicine.id)) continue;

    let score = 0;
    let rxnormMatch = false;

    // Strategy 1: Exact name matching
    const medicineLower = cleanMedicineName(medicine.name);
    if (extractedLower === medicineLower) {
      score = 0.95;
    }
    // Strategy 2: Contains matching (both directions)
    else if (medicineLower.includes(extractedLower) || extractedLower.includes(medicineLower)) {
      score = 0.85;
    }
    // Strategy 3: Word-based matching
    else {
      score = calculateEnhancedTextSimilarity(extractedLower, medicine.name);
    }

    // Strategy 4: Brand name and generic name cross-matching
    const brandScore = checkBrandNameMatching(extractedLower, medicine.name);
    if (brandScore > score) {
      score = brandScore;
    }

    // Strategy 5: Partial word matching with higher threshold
    const partialScore = calculatePartialWordMatching(extractedLower, medicine.name);
    if (partialScore > score) {
      score = partialScore;
    }

    console.log(`Enhanced similarity for ${medicine.name}: ${score}`);

    if (score > highestScore && score > 0.3) { // Lowered threshold for better matching
      highestScore = score;
      bestMatch = {
        medicine,
        confidence: score,
        rxnormMatch
      };
    }
  }

  return bestMatch;
};

const calculateEnhancedTextSimilarity = (extracted: string, medicineName: string): number => {
  const extractedClean = cleanMedicineName(extracted);
  const medicineClean = cleanMedicineName(medicineName);
  
  // Enhanced exact match
  if (extractedClean === medicineClean) {
    return 0.95;
  }
  
  // Enhanced contains match with better scoring
  if (medicineClean.includes(extractedClean)) {
    return 0.9 * (extractedClean.length / medicineClean.length);
  }
  if (extractedClean.includes(medicineClean)) {
    return 0.85 * (medicineClean.length / extractedClean.length);
  }
  
  // Check for common medicine variations
  const variationScore = checkMedicineVariations(extractedClean, medicineClean);
  if (variationScore > 0) {
    return variationScore;
  }
  
  // Enhanced word-based matching with better algorithm
  return calculateWordBasedSimilarity(extractedClean, medicineClean);
};

const checkBrandNameMatching = (extracted: string, medicineName: string): number => {
  const brandMappings: { [key: string]: string[] } = {
    'paracetamol': ['dolo', 'crocin', 'metacin', 'pyrigesic', 'pacimol'],
    'ibuprofen': ['brufen', 'combiflam', 'ibupain', 'ibugesic'],
    'azithromycin': ['azee', 'azithral', 'azax', 'azibact'],
    'amoxicillin': ['amoxil', 'augmentin', 'moxikind', 'novamox'],
    'omeprazole': ['omez', 'prilosec', 'omepraz', 'ocid'],
    'pantoprazole': ['pantop', 'pantocid', 'protonix', 'pantosec'],
    'metformin': ['glycomet', 'glucophage', 'diabecon', 'metsmall'],
    'amlodipine': ['amlopres', 'amlokind', 'stamlo', 'amtas'],
    'atorvastatin': ['storvas', 'lipicure', 'atorlip', 'tonact'],
    'cetirizine': ['zyrtec', 'alerid', 'cetrizine', 'okacet']
  };
  
  const extractedLower = extracted.toLowerCase();
  const medicineLower = medicineName.toLowerCase();
  
  // Check if extracted matches any brand of the medicine
  for (const [generic, brands] of Object.entries(brandMappings)) {
    if (medicineLower.includes(generic)) {
      for (const brand of brands) {
        if (extractedLower.includes(brand) || brand.includes(extractedLower)) {
          return 0.88;
        }
      }
    }
    // Check reverse - if medicine is brand, extracted might be generic
    if (brands.some(brand => medicineLower.includes(brand))) {
      if (extractedLower.includes(generic) || generic.includes(extractedLower)) {
        return 0.88;
      }
    }
  }
  
  return 0;
};

const calculatePartialWordMatching = (extracted: string, medicineName: string): number => {
  const extractedWords = extracted.split(/\s+/).filter(word => word.length > 2);
  const medicineWords = cleanMedicineName(medicineName).split(/\s+/).filter(word => word.length > 2);
  
  if (extractedWords.length === 0 || medicineWords.length === 0) return 0;
  
  let matchScore = 0;
  let totalChecks = 0;
  
  for (const extractedWord of extractedWords) {
    for (const medicineWord of medicineWords) {
      totalChecks++;
      
      // Exact word match
      if (extractedWord === medicineWord) {
        matchScore += 1.0;
      }
      // Partial word match
      else if (extractedWord.includes(medicineWord) || medicineWord.includes(extractedWord)) {
        const longer = extractedWord.length > medicineWord.length ? extractedWord : medicineWord;
        const shorter = extractedWord.length > medicineWord.length ? medicineWord : extractedWord;
        matchScore += (shorter.length / longer.length) * 0.8;
      }
      // Fuzzy word match
      else if (calculateEditDistance(extractedWord, medicineWord) <= 2 && 
               Math.min(extractedWord.length, medicineWord.length) >= 4) {
        matchScore += 0.6;
      }
    }
  }
  
  return totalChecks > 0 ? Math.min(matchScore / totalChecks, 0.9) : 0;
};

const calculateWordBasedSimilarity = (extracted: string, medicineName: string): number => {
  const extractedWords = extracted.split(/\s+/).filter(word => word.length > 2);
  const medicineWords = cleanMedicineName(medicineName).split(/\s+/).filter(word => word.length > 2);
  
  if (extractedWords.length === 0 || medicineWords.length === 0) return 0;
  
  let matchingWords = 0;
  const totalWords = Math.max(extractedWords.length, medicineWords.length);
  
  for (const extractedWord of extractedWords) {
    let bestWordMatch = 0;
    
    for (const medicineWord of medicineWords) {
      // Exact word match
      if (extractedWord === medicineWord) {
        bestWordMatch = Math.max(bestWordMatch, 1.0);
      }
      // Fuzzy word match
      else if (calculateEditDistance(extractedWord, medicineWord) <= 2 && 
               Math.min(extractedWord.length, medicineWord.length) >= 4) {
        bestWordMatch = Math.max(bestWordMatch, 0.8);
      }
      // Partial word match
      else if ((extractedWord.includes(medicineWord) || medicineWord.includes(extractedWord)) &&
               Math.min(extractedWord.length, medicineWord.length) >= 3) {
        bestWordMatch = Math.max(bestWordMatch, 0.6);
      }
    }
    
    matchingWords += bestWordMatch;
  }
  
  return Math.min(matchingWords / totalWords, 0.9);
};

const checkMedicineVariations = (extracted: string, medicineName: string): number => {
  const commonVariations: { [key: string]: string[] } = {
    'paracetamol': ['acetaminophen', 'tylenol', 'crocin', 'dolo', 'metacin'],
    'acetaminophen': ['paracetamol', 'tylenol', 'crocin', 'dolo'],
    'ibuprofen': ['advil', 'brufen', 'combiflam', 'nurofen'],
    'azithromycin': ['azee', 'zithromax', 'azithral', 'azax'],
    'amoxicillin': ['amoxil', 'augmentin', 'novamox', 'moxikind'],
    'diclofenac': ['voltaren', 'voveran', 'diclomax', 'dynapar'],
    'cetirizine': ['zyrtec', 'cetrizine', 'alerid', 'okacet'],
    'omeprazole': ['prilosec', 'omez', 'ocid', 'omepraz'],
    'pantoprazole': ['protonix', 'pantocid', 'pantop', 'pantosec'],
    'metformin': ['glucophage', 'glycomet', 'diabecon', 'metsmall'],
    'amlodipine': ['norvasc', 'amlopres', 'stamlo', 'amtas'],
    'atorvastatin': ['lipitor', 'storvas', 'lipicure', 'atorlip']
  };
  
  for (const [key, variations] of Object.entries(commonVariations)) {
    if (extracted.includes(key) && variations.some(v => cleanMedicineName(medicineName).includes(v))) {
      return 0.85;
    }
    if (variations.some(v => extracted.includes(v)) && cleanMedicineName(medicineName).includes(key)) {
      return 0.85;
    }
  }
  
  return 0;
};

const cleanMedicineName = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/\d+(\.\d+)?\s*(mg|ml|gm|mcg|g|tab|tablet|capsule|cap|syrup|injection|inj)/gi, '')
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
};

const calculateEditDistance = (str1: string, str2: string): number => {
  const dp: number[][] = Array(str1.length + 1).fill(null).map(() => Array(str2.length + 1).fill(0));
  
  for (let i = 0; i <= str1.length; i++) dp[i][0] = i;
  for (let j = 0; j <= str2.length; j++) dp[0][j] = j;
  
  for (let i = 1; i <= str1.length; i++) {
    for (let j = 1; j <= str2.length; j++) {
      if (str1[i - 1] === str2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]) + 1;
      }
    }
  }
  
  return dp[str1.length][str2.length];
};

export const savePrescriptionToDatabase = async (
  imageUrl: string,
  ocrData: any,
  extractedMedicines: string[]
) => {
  try {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user.user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('prescriptions')
      .insert({
        user_id: user.user.id,
        image_url: imageUrl,
        status: 'pending',
        medicines: extractedMedicines,
        ocr_data: ocrData
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error saving prescription:', error);
    throw error;
  }
};
