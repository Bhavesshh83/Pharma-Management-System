
import { supabase } from '@/integrations/supabase/client';
import type { Medicine } from '@/types';

export interface MedicineMatch {
  medicine: Medicine;
  confidence: number;
  rxnormMatch: boolean;
}

export const searchMedicinesInDatabase = async (extractedMedicines: string[]): Promise<MedicineMatch[]> => {
  try {
    // Fetch all medicines from database
    const { data: medicines, error } = await supabase
      .from('medicines')
      .select('*')
      .eq('in_stock', true);

    if (error) {
      console.error('Error fetching medicines:', error);
      return [];
    }

    const matches: MedicineMatch[] = [];

    for (const extractedMedicine of extractedMedicines) {
      // Try to find matches using RxNorm API
      const rxnormMatch = await lookupInRxNorm(extractedMedicine);
      
      // Find best match in our database
      const bestMatch = findBestDatabaseMatch(extractedMedicine, medicines, rxnormMatch);
      
      if (bestMatch) {
        matches.push(bestMatch);
      }
    }

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
  const extractedLower = extractedName.toLowerCase();
  let bestMatch: MedicineMatch | null = null;
  let highestScore = 0;

  for (const medicine of medicines) {
    let score = 0;
    let rxnormMatch = false;

    // Check if RxNorm codes match
    if (rxnormData?.rxnormCode && medicine.rxnorm_code === rxnormData.rxnormCode) {
      score = 1.0; // Perfect match via RxNorm
      rxnormMatch = true;
    } else {
      // Fallback to text matching
      const medicineLower = medicine.name.toLowerCase();
      
      // Exact match
      if (medicineLower === extractedLower) {
        score = 0.9;
      }
      // Contains match
      else if (medicineLower.includes(extractedLower) || extractedLower.includes(medicineLower)) {
        score = 0.7;
      }
      // Word-based matching
      else {
        const extractedWords = extractedLower.split(/\s+/);
        const medicineWords = medicineLower.split(/\s+/);
        
        const matchingWords = extractedWords.filter(word => 
          medicineWords.some(mWord => mWord.includes(word) || word.includes(mWord))
        );
        
        if (matchingWords.length > 0) {
          score = (matchingWords.length / Math.max(extractedWords.length, medicineWords.length)) * 0.6;
        }
      }
    }

    if (score > highestScore && score > 0.5) { // Minimum confidence threshold
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
