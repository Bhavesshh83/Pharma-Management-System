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
    
    // Enhanced OCR WITHOUT tessedit_pageseg_mode (which is invalid in WorkerOptions)
    const { data: { text } } = await Tesseract.recognize(
      imageFile,
      'eng',
      {
        logger: m => console.log(m),
        preserve_interword_spaces: '1',
        tessedit_char_blacklist: '!@#$%^&*()+={}[]|\\:";\'<>?,./`~',
        tessedit_ocr_engine_mode: Tesseract.OEM.LSTM_ONLY
      }
    );

    console.log('Enhanced OCR extracted text:', text);

    // Enhanced parsing with better medicine detection
    const parsedData = parseEnhancedPrescriptionText(text);
    
    console.log('Enhanced parsed medicines:', parsedData.medicines);
    
    // Search for medicine matches in database and verify with OpenFDA
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

  // Enhanced patterns for doctor names with more variations
  const doctorPatterns = [
    /dr\.?\s+([a-zA-Z\s\.]{3,40})/i,
    /doctor\s+([a-zA-Z\s\.]{3,40})/i,
    /physician\s+([a-zA-Z\s\.]{3,40})/i,
    /([a-zA-Z\s\.]{3,40})\s*,?\s*m\.?d\.?/i,
    /([a-zA-Z\s\.]{3,40})\s*,?\s*mbbs/i,
    /([a-zA-Z\s\.]{3,40})\s*,?\s*md/i,
    /consultant\s+([a-zA-Z\s\.]{3,40})/i
  ];

  // Enhanced patterns for patient names
  const patientPatterns = [
    /patient\s*:?\s*([a-zA-Z\s\.]{3,40})/i,
    /name\s*:?\s*([a-zA-Z\s\.]{3,40})/i,
    /mr\.?\s*([a-zA-Z\s\.]{3,40})/i,
    /mrs\.?\s*([a-zA-Z\s\.]{3,40})/i,
    /ms\.?\s*([a-zA-Z\s\.]{3,40})/i,
    /for\s+([a-zA-Z\s\.]{3,40})/i,
    /prescribed\s+to\s+([a-zA-Z\s\.]{3,40})/i
  ];

  // Comprehensive medicine database with Indian brands and generics
  const medicineDatabase = [
    // Pain relievers
    'paracetamol', 'acetaminophen', 'dolo', 'crocin', 'metacin', 'pyrigesic',
    'ibuprofen', 'brufen', 'combiflam', 'ibupain', 'nurofen',
    'aspirin', 'disprin', 'ecosprin',
    'diclofenac', 'voveran', 'dynapar', 'voltaren',
    'naproxen', 'naprosyn',
    
    // Antibiotics
    'amoxicillin', 'amoxil', 'augmentin', 'novamox', 'moxikind',
    'azithromycin', 'azee', 'azithral', 'azax', 'zithromax',
    'ciprofloxacin', 'cifran', 'ciplox', 'cipro',
    'doxycycline', 'doxt', 'doxy',
    'clarithromycin', 'claribid', 'klacid',
    'cephalexin', 'sporidex', 'cefalexin',
    'levofloxacin', 'levaquin', 'tavanic',
    
    // Diabetes medications
    'metformin', 'glycomet', 'glucophage', 'diabecon', 'metsmall',
    'glipizide', 'glucotrol', 'minidiab',
    'glyburide', 'glibenclamide', 'daonil',
    'sitagliptin', 'januvia', 'zita',
    'insulin', 'humulin', 'lantus', 'novolog',
    
    // Blood pressure medications
    'amlodipine', 'amlopres', 'stamlo', 'amtas', 'norvasc',
    'lisinopril', 'prinivil', 'zestril',
    'losartan', 'cozaar', 'losacar',
    'atenolol', 'tenormin', 'aten',
    'metoprolol', 'lopressor', 'betaloc',
    'enalapril', 'vasotec', 'enace',
    'telmisartan', 'telma', 'micardis',
    
    // Stomach medications
    'omeprazole', 'omez', 'prilosec', 'ocid',
    'pantoprazole', 'pantop', 'protonix', 'pantocid',
    'ranitidine', 'rantac', 'aciloc',
    'famotidine', 'pepcid', 'famocid',
    'lansoprazole', 'prevacid', 'lanzol',
    'esomeprazole', 'nexium', 'esoz',
    
    // Cholesterol medications
    'atorvastatin', 'lipitor', 'storvas', 'atorlip', 'lipicure',
    'simvastatin', 'zocor', 'simvotin',
    'rosuvastatin', 'crestor', 'rosuvas',
    'pravastatin', 'pravachol',
    
    // Thyroid medications
    'levothyroxine', 'synthroid', 'thyronorm', 'eltroxin',
    'methimazole', 'tapazole', 'anti-thyroid',
    'propylthiouracil', 'ptu',
    
    // Mental health medications
    'sertraline', 'zoloft', 'sertima',
    'fluoxetine', 'prozac', 'fludac',
    'paroxetine', 'paxil', 'parotin',
    'escitalopram', 'lexapro', 'citadep',
    'lorazepam', 'ativan', 'lorazep',
    'alprazolam', 'xanax', 'alzolam',
    'clonazepam', 'klonopin', 'lonazep',
    
    // Respiratory medications
    'albuterol', 'salbutamol', 'asthalin', 'ventolin',
    'budesonide', 'pulmicort', 'budecort',
    'prednisolone', 'orapred', 'wysolone',
    'montelukast', 'singulair', 'montair',
    'theophylline', 'theo-dur', 'deriphyllin',
    
    // Allergy medications
    'cetirizine', 'zyrtec', 'cetrizine', 'alerid',
    'loratadine', 'claritin', 'lorfast',
    'fexofenadine', 'allegra', 'fexova',
    'diphenhydramine', 'benadryl', 'avil',
    
    // Vitamins and supplements
    'vitamin', 'calcium', 'iron', 'folic', 'acid',
    'shelcal', 'calcimax', 'ostocalcium', 'calcitas',
    'becosules', 'neurobion', 'mecobalamin',
    
    // Other common medicines
    'digoxin', 'lanoxin', 'digitalis',
    'warfarin', 'coumadin', 'warf',
    'clopidogrel', 'plavix', 'clopivas',
    'rivaroxaban', 'xarelto',
    
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
  const allWords = text.toLowerCase().split(/[\s\n\r.,;:()\-\[\]]+/).filter(word => word.length > 2);
  const uniqueMedicines = new Set<string>();

  // Strategy 1: Direct database matching with fuzzy search
  for (const word of allWords) {
    for (const medicine of medicineDatabase) {
      // Exact match
      if (word === medicine) {
        uniqueMedicines.add(capitalizeFirstLetter(medicine));
      }
      // Partial match (medicine contains word or word contains medicine)
      else if (word.includes(medicine) || medicine.includes(word)) {
        if (word.length >= 3 && medicine.length >= 3) {
          uniqueMedicines.add(capitalizeFirstLetter(medicine));
        }
      }
      // Fuzzy match for common misspellings
      else if (calculateSimilarity(word, medicine) > 0.8 && word.length >= 4) {
        uniqueMedicines.add(capitalizeFirstLetter(medicine));
      }
    }
  }

  // Strategy 2: Line-by-line pattern matching with enhanced regex
  for (const line of lines) {
    const lowerLine = line.toLowerCase();
    
    // Skip header/footer lines
    if (lowerLine.includes('prescription') || lowerLine.includes('clinic') || 
        lowerLine.includes('hospital') || lowerLine.includes('doctor') ||
        lowerLine.includes('patient') || lowerLine.includes('date') ||
        lowerLine.includes('signature') || lowerLine.includes('stamp')) {
      continue;
    }

    // Enhanced medicine extraction patterns
    const medicinePatterns = [
      // Pattern 1: Number. Medicine Name dosage
      /^\s*\d+\.?\s*([a-zA-Z][a-zA-Z\s]{2,25})(?:\s+\d+(?:\.\d+)?\s*(?:mg|ml|gm|mcg|g|tab|tablet|capsule|cap|syrup|injection|inj|drops))?/i,
      // Pattern 2: Medicine Name followed by dosage
      /([a-zA-Z][a-zA-Z\s]{2,25})\s+\d+(?:\.\d+)?\s*(?:mg|ml|gm|mcg|g)/i,
      // Pattern 3: Tab/Cap Medicine Name
      /(?:tab|tablet|cap|capsule)\s+([a-zA-Z][a-zA-Z\s]{2,25})/i,
      // Pattern 4: Medicine Name with strength notation
      /([a-zA-Z][a-zA-Z\s]{2,25})\s*\(\s*\d+(?:\.\d+)?\s*(?:mg|ml|gm|mcg|g)\s*\)/i,
      // Pattern 5: Simple medicine name on its own line
      /^\s*([a-zA-Z][a-zA-Z\s]{3,25})\s*$/i
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
        
        // Validate and match against database
        if (extractedName.length >= 3 && extractedName.length <= 25) {
          const lowerExtracted = extractedName.toLowerCase();
          for (const medicine of medicineDatabase) {
            if (lowerExtracted.includes(medicine) || medicine.includes(lowerExtracted) ||
                calculateSimilarity(lowerExtracted, medicine) > 0.7) {
              uniqueMedicines.add(capitalizeFirstLetter(extractedName));
              break;
            }
          }
        }
      }
    }
  }

  const finalMedicines = Array.from(uniqueMedicines).slice(0, 15); // Limit to 15 medicines

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
