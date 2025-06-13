
import Tesseract from 'tesseract.js';
import { searchMedicinesInDatabase, savePrescriptionToDatabase } from './medicineService';

export interface PrescriptionData {
  doctorName: string;
  patientName: string;
  uploadDate: string;
  medicines: string[];
  rawText: string;
  medicineMatches?: any[];
  prescriptionId?: string;
}

export const extractPrescriptionData = async (imageFile: File): Promise<PrescriptionData> => {
  try {
    console.log('Starting OCR processing...');
    
    const { data: { text } } = await Tesseract.recognize(
      imageFile,
      'eng',
      {
        logger: m => console.log(m)
      }
    );

    console.log('Extracted text:', text);

    // Parse the extracted text to find relevant information
    const parsedData = parsePrescriptionText(text);
    
    console.log('Parsed medicines:', parsedData.medicines);
    
    // Search for medicine matches in database
    const medicineMatches = await searchMedicinesInDatabase(parsedData.medicines);
    
    console.log('Medicine matches found:', medicineMatches.length);
    
    // Save prescription to database for tracking
    const imageUrl = URL.createObjectURL(imageFile); // In production, upload to Supabase Storage
    
    const ocrData = {
      doctorName: parsedData.doctorName,
      patientName: parsedData.patientName,
      extractedMedicines: parsedData.medicines,
      rawText: text,
      confidence: 0.8 // Simplified confidence score
    };

    const savedPrescription = await savePrescriptionToDatabase(
      imageUrl,
      ocrData,
      parsedData.medicines
    );
    
    return {
      ...parsedData,
      rawText: text,
      uploadDate: new Date().toISOString().split('T')[0],
      medicineMatches,
      prescriptionId: savedPrescription.id
    };
  } catch (error) {
    console.error('OCR processing failed:', error);
    throw new Error('Failed to process prescription image');
  }
};

const parsePrescriptionText = (text: string): Omit<PrescriptionData, 'rawText' | 'uploadDate' | 'medicineMatches' | 'prescriptionId'> => {
  const lines = text.split('\n').filter(line => line.trim().length > 0);
  
  let doctorName = '';
  let patientName = '';
  const medicines: string[] = [];

  // Enhanced patterns for doctor names
  const doctorPatterns = [
    /dr\.?\s+([a-zA-Z\s\.]{3,30})/i,
    /doctor\s+([a-zA-Z\s\.]{3,30})/i,
    /physician\s+([a-zA-Z\s\.]{3,30})/i,
    /([a-zA-Z\s\.]{3,30})\s*,?\s*m\.?d\.?/i,
    /([a-zA-Z\s\.]{3,30})\s*,?\s*mbbs/i
  ];

  // Enhanced patterns for patient names
  const patientPatterns = [
    /patient\s*:?\s*([a-zA-Z\s\.]{3,30})/i,
    /name\s*:?\s*([a-zA-Z\s\.]{3,30})/i,
    /mr\.?\s*([a-zA-Z\s\.]{3,30})/i,
    /mrs\.?\s*([a-zA-Z\s\.]{3,30})/i,
    /ms\.?\s*([a-zA-Z\s\.]{3,30})/i,
    /patient.*?([a-zA-Z\s\.]{3,30})/i
  ];

  // Enhanced medicine detection with common patterns
  const medicineKeywords = [
    'tablet', 'tab', 'capsule', 'cap', 'syrup', 'injection', 'inj', 'drops', 'cream', 'ointment',
    'paracetamol', 'acetaminophen', 'aspirin', 'ibuprofen', 'amoxicillin', 'azithromycin',
    'metformin', 'omeprazole', 'cetirizine', 'ranitidine', 'diclofenac', 'prednisolone',
    'amlodipine', 'lisinopril', 'losartan', 'atenolol', 'sertraline', 'fluoxetine',
    'atorvastatin', 'simvastatin', 'levothyroxine', 'warfarin', 'insulin', 'albuterol',
    'mg', 'ml', 'gm', 'mcg', 'twice daily', 'once daily', 'thrice daily', 'bd', 'od', 'tid',
    'dolo', 'crocin', 'combiflam', 'azee', 'augmentin', 'brufen', 'voltaren', 'zyrtec',
    'prilosec', 'glucophage', 'norvasc', 'zestril', 'cozaar', 'tenormin', 'zoloft', 'prozac',
    'lipitor', 'zocor', 'synthroid', 'coumadin', 'lantus', 'ventolin'
  ];

  // Extract doctor name
  for (const line of lines) {
    for (const pattern of doctorPatterns) {
      const match = line.match(pattern);
      if (match && match[1]) {
        doctorName = match[1].trim().replace(/[.,]+$/, '');
        break;
      }
    }
    if (doctorName) break;
  }

  // Extract patient name
  for (const line of lines) {
    for (const pattern of patientPatterns) {
      const match = line.match(pattern);
      if (match && match[1]) {
        patientName = match[1].trim().replace(/[.,]+$/, '');
        break;
      }
    }
    if (patientName) break;
  }

  // Enhanced medicine extraction with multiple approaches
  for (const line of lines) {
    const lowerLine = line.toLowerCase();
    
    // Approach 1: Check if line contains medicine-related keywords
    const containsMedicineKeyword = medicineKeywords.some(keyword => 
      lowerLine.includes(keyword.toLowerCase())
    );
    
    // Approach 2: Pattern matching for common medicine formats
    const medicinePatterns = [
      // Pattern: Number. Medicine Name dosage
      /^\s*\d+\.?\s*([a-zA-Z][a-zA-Z\s]{2,25})(?:\s+\d+(?:\.\d+)?\s*(?:mg|ml|gm|mcg))?/i,
      // Pattern: Medicine Name followed by dosage
      /([a-zA-Z][a-zA-Z\s]{2,25})\s+\d+(?:\.\d+)?\s*(?:mg|ml|gm|mcg)/i,
      // Pattern: Common medicine brand names
      /(paracetamol|acetaminophen|ibuprofen|aspirin|amoxicillin|azithromycin|metformin|omeprazole|cetirizine|diclofenac|amlodipine|lisinopril|atorvastatin|levothyroxine|dolo|crocin|combiflam|azee)/i
    ];
    
    // Approach 3: Look for lines that start with capital letter and contain medicine-like words
    const startsWithCapitalPattern = /^[A-Z][a-zA-Z\s]{2,25}(?:\s+\d+(?:\.\d+)?\s*(?:mg|ml|gm|mcg))?/;
    
    if (containsMedicineKeyword || startsWithCapitalPattern.test(line)) {
      // Try to extract medicine name using patterns
      let extractedMedicine = '';
      
      for (const pattern of medicinePatterns) {
        const match = line.match(pattern);
        if (match && match[1]) {
          extractedMedicine = match[1].trim();
          break;
        }
      }
      
      // If no pattern matches, use the whole line (cleaned)
      if (!extractedMedicine && line.trim().length > 3 && line.trim().length < 50) {
        extractedMedicine = line.trim()
          .replace(/^\d+\.?\s*/, '') // Remove numbering
          .replace(/\s*-\s*.*$/, '') // Remove instructions after dash
          .replace(/\s+/g, ' ') // Normalize spaces
          .trim();
      }
      
      // Clean and validate the extracted medicine name
      if (extractedMedicine) {
        // Remove common non-medicine words
        const nonMedicineWords = ['take', 'daily', 'morning', 'evening', 'after', 'before', 'meal', 'food', 'water', 'times', 'days', 'weeks'];
        const words = extractedMedicine.toLowerCase().split(/\s+/);
        const cleanWords = words.filter(word => !nonMedicineWords.includes(word) && word.length > 2);
        
        if (cleanWords.length > 0) {
          const cleanedMedicine = cleanWords.join(' ');
          
          // Final validation: must be at least 3 characters and not already in the list
          if (cleanedMedicine.length >= 3 && !medicines.includes(cleanedMedicine)) {
            medicines.push(cleanedMedicine);
          }
        }
      }
    }
  }

  // Additional fallback: scan for any word that matches known medicine patterns
  const allText = text.toLowerCase();
  for (const keyword of medicineKeywords) {
    if (allText.includes(keyword) && keyword.length > 3 && !medicines.some(m => m.toLowerCase().includes(keyword))) {
      medicines.push(keyword);
    }
  }

  console.log('Final extracted medicines:', medicines);

  return {
    doctorName: doctorName || 'Not detected',
    patientName: patientName || 'Not detected',
    medicines: medicines.slice(0, 15) // Limit to 15 medicines
  };
};
