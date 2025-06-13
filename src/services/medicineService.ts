
import { supabase } from '@/integrations/supabase/client';
import type { Medicine } from '@/types';

export interface MedicineMatch {
  medicine: Medicine;
  confidence: number;
  rxnormMatch: boolean;
}

export const searchMedicinesInDatabase = async (extractedMedicines: string[]): Promise<MedicineMatch[]> => {
  try {
    console.log('Searching for medicines:', extractedMedicines);
    
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

    for (const extractedMedicine of extractedMedicines) {
      console.log('Processing extracted medicine:', extractedMedicine);
      
      // Try to find matches using RxNorm API
      const rxnormMatch = await lookupInRxNorm(extractedMedicine);
      
      // Find best match in our database
      const bestMatch = findBestDatabaseMatch(extractedMedicine, medicines, rxnormMatch);
      
      if (bestMatch) {
        console.log('Found match:', bestMatch);
        matches.push(bestMatch);
      } else {
        console.log('No match found for:', extractedMedicine);
      }
    }

    console.log('Total matches found:', matches.length);
    return matches;
  } catch (error) {
    console.error('Error searching medicines:', error);
    return [];
  }
};

const lookupInRxNorm = async (medicineName: string) => {
  try {
    const { data, error } = await supabase.functions.invoke('rxnorm-lookup', {
      body: { medicineName }
    });

    if (error) {
      console.error('RxNorm lookup error:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('RxNorm API error:', error);
    return null;
  }
};

const findBestDatabaseMatch = (
  extractedName: string, 
  medicines: any[], 
  rxnormData: any
): MedicineMatch | null => {
  const extractedLower = cleanMedicineName(extractedName);
  let bestMatch: MedicineMatch | null = null;
  let highestScore = 0;

  console.log('Finding match for cleaned name:', extractedLower);

  for (const medicine of medicines) {
    let score = 0;
    let rxnormMatch = false;

    // Check if RxNorm codes match
    if (rxnormData?.rxnormCode && medicine.rxnorm_code === rxnormData.rxnormCode) {
      score = 1.0; // Perfect match via RxNorm
      rxnormMatch = true;
      console.log('RxNorm match found:', medicine.name);
    } else {
      // Enhanced text matching
      score = calculateTextSimilarity(extractedLower, medicine.name);
      console.log(`Text similarity for ${medicine.name}: ${score}`);
    }

    if (score > highestScore && score > 0.4) { // Lowered threshold for better matching
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

const cleanMedicineName = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/\d+(\.\d+)?\s*(mg|ml|gm|mcg|g|tab|tablet|capsule|cap|syrup|injection|inj)/gi, '') // Remove dosages
    .replace(/[^\w\s]/g, ' ') // Replace special characters with spaces
    .replace(/\s+/g, ' ') // Normalize spaces
    .trim();
};

const calculateTextSimilarity = (extracted: string, medicineName: string): number => {
  const extractedClean = cleanMedicineName(extracted);
  const medicineClean = cleanMedicineName(medicineName);
  
  // Exact match
  if (extractedClean === medicineClean) {
    return 0.95;
  }
  
  // Contains match (either direction)
  if (medicineClean.includes(extractedClean) || extractedClean.includes(medicineClean)) {
    return 0.85;
  }
  
  // Check for common medicine name variations
  const variations = getCommonVariations(extractedClean);
  for (const variation of variations) {
    if (medicineClean.includes(variation) || variation.includes(medicineClean)) {
      return 0.8;
    }
  }
  
  // Word-based matching with fuzzy logic
  const extractedWords = extractedClean.split(/\s+/).filter(word => word.length > 2);
  const medicineWords = medicineClean.split(/\s+/).filter(word => word.length > 2);
  
  let matchingWords = 0;
  let totalWords = Math.max(extractedWords.length, medicineWords.length);
  
  for (const extractedWord of extractedWords) {
    for (const medicineWord of medicineWords) {
      // Exact word match
      if (extractedWord === medicineWord) {
        matchingWords += 1;
        break;
      }
      // Fuzzy word match (edit distance)
      else if (calculateEditDistance(extractedWord, medicineWord) <= 2 && 
               Math.min(extractedWord.length, medicineWord.length) >= 4) {
        matchingWords += 0.8;
        break;
      }
      // Partial word match
      else if ((extractedWord.includes(medicineWord) || medicineWord.includes(extractedWord)) &&
               Math.min(extractedWord.length, medicineWord.length) >= 3) {
        matchingWords += 0.6;
        break;
      }
    }
  }
  
  return Math.min(matchingWords / totalWords, 0.9);
};

const getCommonVariations = (medicineName: string): string[] => {
  const variations = [medicineName];
  
  // Common medicine name variations
  const commonVariations: { [key: string]: string[] } = {
    'paracetamol': ['acetaminophen', 'tylenol', 'crocin', 'dolo'],
    'acetaminophen': ['paracetamol', 'tylenol', 'crocin', 'dolo'],
    'ibuprofen': ['advil', 'brufen', 'combiflam'],
    'azithromycin': ['azee', 'zithromax'],
    'amoxicillin': ['amoxil', 'augmentin'],
    'diclofenac': ['voltaren', 'voveran'],
    'cetirizine': ['zyrtec', 'cetrizine'],
    'omeprazole': ['prilosec', 'omez'],
    'pantoprazole': ['protonix', 'pantocid'],
    'metformin': ['glucophage', 'glycomet'],
  };
  
  // Add variations based on the input
  for (const [key, values] of Object.entries(commonVariations)) {
    if (medicineName.includes(key)) {
      variations.push(...values);
    }
  }
  
  return variations;
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
