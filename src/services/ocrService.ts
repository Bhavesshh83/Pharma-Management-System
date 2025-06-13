
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
    console.log('Starting enhanced OCR processing...');
    
    // Enhanced OCR with better configuration
    const { data: { text } } = await Tesseract.recognize(
      imageFile,
      'eng',
      {
        logger: m => console.log(m),
        tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789.,()-/ ',
        tessedit_pageseg_mode: Tesseract.PSM.AUTO,
        preserve_interword_spaces: '1'
      }
    );

    console.log('Enhanced OCR extracted text:', text);

    // Enhanced parsing with better medicine detection
    const parsedData = parseEnhancedPrescriptionText(text);
    
    console.log('Enhanced parsed medicines:', parsedData.medicines);
    
    // Search for medicine matches in database
    const medicineMatches = await searchMedicinesInDatabase(parsedData.medicines);
    
    console.log('Medicine matches found:', medicineMatches.length);
    
    // Save prescription to database for tracking
    const imageUrl = URL.createObjectURL(imageFile);
    
    const ocrData = {
      doctorName: parsedData.doctorName,
      patientName: parsedData.patientName,
      extractedMedicines: parsedData.medicines,
      rawText: text,
      confidence: 0.85
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
    console.error('Enhanced OCR processing failed:', error);
    throw new Error('Failed to process prescription image with enhanced OCR');
  }
};

const parseEnhancedPrescriptionText = (text: string): Omit<PrescriptionData, 'rawText' | 'uploadDate' | 'medicineMatches' | 'prescriptionId'> => {
  const lines = text.split('\n').filter(line => line.trim().length > 0);
  
  let doctorName = '';
  let patientName = '';
  const medicines: string[] = [];

  // Enhanced patterns for doctor names
  const doctorPatterns = [
    /dr\.?\s+([a-zA-Z\s\.]{3,40})/i,
    /doctor\s+([a-zA-Z\s\.]{3,40})/i,
    /physician\s+([a-zA-Z\s\.]{3,40})/i,
    /([a-zA-Z\s\.]{3,40})\s*,?\s*m\.?d\.?/i,
    /([a-zA-Z\s\.]{3,40})\s*,?\s*mbbs/i,
    /([a-zA-Z\s\.]{3,40})\s*,?\s*md/i
  ];

  // Enhanced patterns for patient names
  const patientPatterns = [
    /patient\s*:?\s*([a-zA-Z\s\.]{3,40})/i,
    /name\s*:?\s*([a-zA-Z\s\.]{3,40})/i,
    /mr\.?\s*([a-zA-Z\s\.]{3,40})/i,
    /mrs\.?\s*([a-zA-Z\s\.]{3,40})/i,
    /ms\.?\s*([a-zA-Z\s\.]{3,40})/i,
    /for\s+([a-zA-Z\s\.]{3,40})/i
  ];

  // Comprehensive medicine database for better matching
  const medicineDatabase = [
    // Common generic names
    'paracetamol', 'acetaminophen', 'ibuprofen', 'aspirin', 'diclofenac', 'naproxen',
    'amoxicillin', 'azithromycin', 'ciprofloxacin', 'doxycycline', 'clarithromycin', 'cephalexin',
    'metformin', 'insulin', 'glipizide', 'glyburide', 'sitagliptin',
    'amlodipine', 'lisinopril', 'losartan', 'atenolol', 'metoprolol', 'enalapril',
    'omeprazole', 'pantoprazole', 'ranitidine', 'famotidine', 'lansoprazole',
    'atorvastatin', 'simvastatin', 'rosuvastatin', 'pravastatin',
    'levothyroxine', 'methimazole', 'propylthiouracil',
    'sertraline', 'fluoxetine', 'paroxetine', 'escitalopram', 'lorazepam', 'alprazolam',
    'albuterol', 'salbutamol', 'budesonide', 'prednisolone', 'montelukast',
    'warfarin', 'aspirin', 'clopidogrel', 'rivaroxaban',
    'cetirizine', 'loratadine', 'fexofenadine', 'diphenhydramine',
    
    // Indian brand names
    'dolo', 'crocin', 'combiflam', 'brufen', 'volini', 'moov',
    'azee', 'augmentin', 'cifran', 'norflox', 'oflox',
    'glycomet', 'diabecon', 'glucobay', 'amaryl',
    'telma', 'amlopres', 'cardace', 'ramipril', 'olmesar',
    'pantop', 'omez', 'razo', 'peptica', 'zinetac',
    'storvas', 'lipicure', 'atorlip', 'rosuvas',
    'thyronorm', 'eltroxin', 'thyrox',
    'nexito', 'prodep', 'flunil', 'petril', 'restyl',
    'asthalin', 'seroflo', 'budecort', 'montair',
    'zyrtec', 'allegra', 'avil', 'cetrizine',
    'shelcal', 'calcimax', 'ostocalcium', 'vitamin',
    
    // Dosage forms
    'tablet', 'capsule', 'syrup', 'injection', 'drops', 'cream', 'ointment', 'inhaler'
  ];

  // Extract doctor name
  for (const line of lines) {
    for (const pattern of doctorPatterns) {
      const match = line.match(pattern);
      if (match && match[1]) {
        const name = match[1].trim().replace(/[.,]+$/, '');
        if (name.length > 2 && name.length < 40) {
          doctorName = name;
          break;
        }
      }
    }
    if (doctorName) break;
  }

  // Extract patient name
  for (const line of lines) {
    for (const pattern of patientPatterns) {
      const match = line.match(pattern);
      if (match && match[1]) {
        const name = match[1].trim().replace(/[.,]+$/, '');
        if (name.length > 2 && name.length < 40 && name !== doctorName) {
          patientName = name;
          break;
        }
      }
    }
    if (patientName) break;
  }

  // Enhanced medicine extraction with multiple strategies
  const allWords = text.toLowerCase().split(/[\s\n\r.,;:()\-]+/).filter(word => word.length > 2);
  const uniqueMedicines = new Set<string>();

  // Strategy 1: Direct database matching
  for (const word of allWords) {
    for (const medicine of medicineDatabase) {
      if (word.includes(medicine) || medicine.includes(word)) {
        if (word.length >= 3) {
          uniqueMedicines.add(capitalizeFirstLetter(medicine));
        }
      }
    }
  }

  // Strategy 2: Line-by-line analysis with enhanced patterns
  for (const line of lines) {
    const lowerLine = line.toLowerCase();
    
    // Skip header lines
    if (lowerLine.includes('prescription') || lowerLine.includes('clinic') || 
        lowerLine.includes('hospital') || lowerLine.includes('doctor') ||
        lowerLine.includes('patient') || lowerLine.includes('date')) {
      continue;
    }

    // Look for medicine patterns
    const medicinePatterns = [
      // Pattern: Number. Medicine Name dosage
      /^\s*\d+\.?\s*([a-zA-Z][a-zA-Z\s]{2,30})(?:\s+\d+(?:\.\d+)?\s*(?:mg|ml|gm|mcg|g|tab|tablet|capsule|cap|syrup|injection|inj|drops))?/i,
      // Pattern: Medicine Name followed by dosage
      /([a-zA-Z][a-zA-Z\s]{2,30})\s+\d+(?:\.\d+)?\s*(?:mg|ml|gm|mcg|g)/i,
      // Pattern: Medicine Name with strength
      /([a-zA-Z][a-zA-Z\s]{2,30})\s*(?:\d+(?:\.\d+)?)?(?:mg|ml|gm|mcg|g)?/i
    ];
    
    for (const pattern of medicinePatterns) {
      const match = line.match(pattern);
      if (match && match[1]) {
        let extractedName = match[1].trim();
        
        // Clean the extracted name
        extractedName = extractedName
          .replace(/^\d+\.?\s*/, '') // Remove numbering
          .replace(/\s*-.*$/, '') // Remove instructions after dash
          .replace(/\s+/g, ' ') // Normalize spaces
          .trim();
        
        // Validate the extracted medicine name
        if (extractedName.length >= 3 && extractedName.length <= 30) {
          // Check if it matches any known medicine
          const lowerExtracted = extractedName.toLowerCase();
          for (const medicine of medicineDatabase) {
            if (lowerExtracted.includes(medicine) || medicine.includes(lowerExtracted)) {
              uniqueMedicines.add(capitalizeFirstLetter(extractedName));
              break;
            }
          }
        }
      }
    }

    // Strategy 3: Fuzzy matching for common misspellings
    const words = line.split(/\s+/).filter(word => word.length > 3);
    for (const word of words) {
      const cleanWord = word.toLowerCase().replace(/[^a-z]/g, '');
      for (const medicine of medicineDatabase) {
        if (calculateSimilarity(cleanWord, medicine) > 0.7) {
          uniqueMedicines.add(capitalizeFirstLetter(medicine));
        }
      }
    }
  }

  // Strategy 4: Context-aware extraction
  const contextKeywords = ['take', 'tablet', 'capsule', 'syrup', 'twice', 'daily', 'morning', 'evening'];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].toLowerCase();
    const hasContext = contextKeywords.some(keyword => line.includes(keyword));
    
    if (hasContext) {
      const words = line.split(/\s+/);
      for (const word of words) {
        const cleanWord = word.replace(/[^a-zA-Z]/g, '');
        if (cleanWord.length >= 4) {
          for (const medicine of medicineDatabase) {
            if (cleanWord.toLowerCase().includes(medicine) || medicine.includes(cleanWord.toLowerCase())) {
              uniqueMedicines.add(capitalizeFirstLetter(medicine));
            }
          }
        }
      }
    }
  }

  const finalMedicines = Array.from(uniqueMedicines).slice(0, 20); // Limit to 20 medicines

  console.log('Final enhanced extracted medicines:', finalMedicines);

  return {
    doctorName: doctorName || 'Not detected',
    patientName: patientName || 'Not detected',
    medicines: finalMedicines
  };
};

// Helper functions
const capitalizeFirstLetter = (string: string): string => {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
};

const calculateSimilarity = (str1: string, str2: string): number => {
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;
  
  if (longer.length === 0) return 1.0;
  
  const distance = levenshteinDistance(longer, shorter);
  return (longer.length - distance) / longer.length;
};

const levenshteinDistance = (str1: string, str2: string): number => {
  const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));
  
  for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
  for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;
  
  for (let j = 1; j <= str2.length; j++) {
    for (let i = 1; i <= str1.length; i++) {
      const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1,
        matrix[j - 1][i] + 1,
        matrix[j - 1][i - 1] + cost
      );
    }
  }
  
  return matrix[str2.length][str1.length];
};
