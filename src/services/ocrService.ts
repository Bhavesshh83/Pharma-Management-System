
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
    
    // Search for medicine matches in database
    const medicineMatches = await searchMedicinesInDatabase(parsedData.medicines);
    
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

  // Common patterns for doctor names
  const doctorPatterns = [
    /dr\.?\s+([a-zA-Z\s]+)/i,
    /doctor\s+([a-zA-Z\s]+)/i,
    /physician\s+([a-zA-Z\s]+)/i
  ];

  // Common patterns for patient names
  const patientPatterns = [
    /patient\s*:?\s*([a-zA-Z\s]+)/i,
    /name\s*:?\s*([a-zA-Z\s]+)/i,
    /mr\.?\s+([a-zA-Z\s]+)/i,
    /mrs\.?\s+([a-zA-Z\s]+)/i,
    /ms\.?\s+([a-zA-Z\s]+)/i
  ];

  // Enhanced medicine keywords and patterns
  const medicineKeywords = [
    'tablet', 'capsule', 'syrup', 'injection', 'drops', 'cream', 'ointment',
    'paracetamol', 'aspirin', 'ibuprofen', 'amoxicillin', 'azithromycin',
    'metformin', 'omeprazole', 'cetirizine', 'ranitidine', 'diclofenac',
    'mg', 'ml', 'gm', 'twice daily', 'once daily', 'thrice daily', 'bd', 'od', 'tid'
  ];

  // Extract doctor name
  for (const line of lines) {
    for (const pattern of doctorPatterns) {
      const match = line.match(pattern);
      if (match && match[1]) {
        doctorName = match[1].trim();
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
        patientName = match[1].trim();
        break;
      }
    }
    if (patientName) break;
  }

  // Extract medicines with improved detection
  for (const line of lines) {
    const lowerLine = line.toLowerCase();
    
    // Check if line contains medicine-related keywords
    const containsMedicineKeyword = medicineKeywords.some(keyword => 
      lowerLine.includes(keyword.toLowerCase())
    );
    
    // Also check for common medicine name patterns
    const medicinePattern = /^[0-9]*\.?\s*([a-zA-Z]+(?:\s+[a-zA-Z]+)*)\s*(?:\d+(?:\.\d+)?\s*(?:mg|ml|gm|mcg))?/i;
    const medicineMatch = line.match(medicinePattern);
    
    if ((containsMedicineKeyword || medicineMatch) && line.trim().length > 3) {
      // Clean and format the medicine name
      let cleanedMedicine = line.trim()
        .replace(/^\d+\.?\s*/, '') // Remove numbering
        .replace(/\s+/g, ' ') // Normalize spaces
        .replace(/\s*-\s*.*$/, '') // Remove dosage instructions after dash
        .trim();
      
      // Extract just the medicine name part if it contains dosage
      const nameMatch = cleanedMedicine.match(/^([a-zA-Z\s]+?)(?:\s+\d+(?:\.\d+)?\s*(?:mg|ml|gm|mcg))?/i);
      if (nameMatch && nameMatch[1]) {
        cleanedMedicine = nameMatch[1].trim();
      }
      
      if (cleanedMedicine.length > 3 && !medicines.includes(cleanedMedicine)) {
        medicines.push(cleanedMedicine);
      }
    }
  }

  return {
    doctorName: doctorName || 'Not detected',
    patientName: patientName || 'Not detected',
    medicines: medicines.slice(0, 10) // Limit to 10 medicines
  };
};
