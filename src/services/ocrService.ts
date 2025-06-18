
import Tesseract from 'tesseract.js';
import { medicines } from '@/data/medicines';

export interface PrescriptionData {
  patientName?: string;
  doctorName?: string;
  medicines: string[];
  rawText: string;
  confidence: number;
  medicineMatches?: Array<{
    extractedName: string;
    medicine: any;
    confidence: number;
  }>;
}

export const extractPrescriptionData = async (file: File): Promise<PrescriptionData> => {
  try {
    console.log('Starting OCR processing...');
    
    // Configure Tesseract with proper options
    const { data: { text, confidence } } = await Tesseract.recognize(file, 'eng', {
      logger: m => console.log(m)
    });

    console.log('OCR completed. Raw text:', text);
    console.log('OCR confidence:', confidence);

    // Extract medicine names from the text
    const extractedMedicines = extractMedicineNames(text);
    console.log('Extracted medicines:', extractedMedicines);

    // Match with database medicines
    const medicineMatches = matchMedicinesWithDatabase(extractedMedicines);
    console.log('Medicine matches:', medicineMatches);

    // Extract patient and doctor names
    const patientName = extractPatientName(text);
    const doctorName = extractDoctorName(text);

    return {
      patientName,
      doctorName,
      medicines: extractedMedicines,
      rawText: text,
      confidence,
      medicineMatches
    };
  } catch (error) {
    console.error('OCR processing failed:', error);
    throw new Error('Failed to process prescription image');
  }
};

const extractMedicineNames = (text: string): string[] => {
  // Common medicine name patterns and known medicine names
  const medicinePatterns = [
    /(?:tab|tablet|cap|capsule|syrup|injection|mg|ml)[\s:]*([a-zA-Z][a-zA-Z\s]{2,20})/gi,
    /([a-zA-Z][a-zA-Z]{3,15})[\s]*(?:\d+)?[\s]*(?:mg|ml|tablet|tab|cap)/gi,
  ];

  const extractedNames = new Set<string>();
  
  // Extract using patterns
  medicinePatterns.forEach(pattern => {
    const matches = text.match(pattern);
    if (matches) {
      matches.forEach(match => {
        const cleaned = match.replace(/(?:tab|tablet|cap|capsule|syrup|injection|mg|ml|\d+)/gi, '').trim();
        if (cleaned.length > 2) {
          extractedNames.add(cleaned);
        }
      });
    }
  });

  // Also look for known medicine names directly
  medicines.forEach(medicine => {
    const medicineName = medicine.name.toLowerCase();
    if (text.toLowerCase().includes(medicineName)) {
      extractedNames.add(medicine.name);
    }
  });

  return Array.from(extractedNames);
};

const matchMedicinesWithDatabase = (extractedNames: string[]) => {
  const matches: Array<{
    extractedName: string;
    medicine: any;
    confidence: number;
  }> = [];

  extractedNames.forEach(extractedName => {
    const bestMatch = findBestMedicineMatch(extractedName);
    if (bestMatch) {
      matches.push({
        extractedName,
        medicine: bestMatch.medicine,
        confidence: bestMatch.confidence
      });
    }
  });

  return matches;
};

const findBestMedicineMatch = (extractedName: string) => {
  let bestMatch = null;
  let highestConfidence = 0;

  medicines.forEach(medicine => {
    const confidence = calculateSimilarity(extractedName.toLowerCase(), medicine.name.toLowerCase());
    if (confidence > highestConfidence && confidence > 0.6) {
      highestConfidence = confidence;
      bestMatch = { medicine, confidence };
    }
  });

  return bestMatch;
};

const calculateSimilarity = (str1: string, str2: string): number => {
  // Simple similarity calculation using Levenshtein distance
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;
  
  if (longer.length === 0) return 1.0;
  
  const distance = levenshteinDistance(longer, shorter);
  return (longer.length - distance) / longer.length;
};

const levenshteinDistance = (str1: string, str2: string): number => {
  const matrix = [];
  
  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }
  
  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }
  
  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  
  return matrix[str2.length][str1.length];
};

const extractPatientName = (text: string): string | undefined => {
  const patterns = [
    /patient[\s:]*([a-zA-Z\s]{3,30})/i,
    /name[\s:]*([a-zA-Z\s]{3,30})/i,
    /mr\.?\s*([a-zA-Z\s]{3,30})/i,
    /mrs\.?\s*([a-zA-Z\s]{3,30})/i,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      return match[1].trim();
    }
  }

  return undefined;
};

const extractDoctorName = (text: string): string | undefined => {
  const patterns = [
    /dr\.?\s*([a-zA-Z\s]{3,30})/i,
    /doctor[\s:]*([a-zA-Z\s]{3,30})/i,
    /physician[\s:]*([a-zA-Z\s]{3,30})/i,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      return match[1].trim();
    }
  }

  return undefined;
};
