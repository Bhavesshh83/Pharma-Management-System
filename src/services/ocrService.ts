
import Tesseract from 'tesseract.js';

export interface PrescriptionData {
  doctorName: string;
  patientName: string;
  uploadDate: string;
  medicines: string[];
  rawText: string;
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
    
    return {
      ...parsedData,
      rawText: text,
      uploadDate: new Date().toISOString().split('T')[0]
    };
  } catch (error) {
    console.error('OCR processing failed:', error);
    throw new Error('Failed to process prescription image');
  }
};

const parsePrescriptionText = (text: string): Omit<PrescriptionData, 'rawText' | 'uploadDate'> => {
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

  // Common medicine keywords and patterns
  const medicineKeywords = [
    'tablet', 'capsule', 'syrup', 'injection', 'drops', 'cream', 'ointment',
    'paracetamol', 'aspirin', 'ibuprofen', 'amoxicillin', 'azithromycin',
    'metformin', 'omeprazole', 'cetirizine', 'ranitidine', 'diclofenac',
    'mg', 'ml', 'gm', 'twice daily', 'once daily', 'thrice daily'
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

  // Extract medicines
  for (const line of lines) {
    const lowerLine = line.toLowerCase();
    
    // Check if line contains medicine-related keywords
    const containsMedicineKeyword = medicineKeywords.some(keyword => 
      lowerLine.includes(keyword.toLowerCase())
    );
    
    if (containsMedicineKeyword && line.trim().length > 3) {
      // Clean and format the medicine name
      const cleanedMedicine = line.trim()
        .replace(/^\d+\.?\s*/, '') // Remove numbering
        .replace(/\s+/g, ' ') // Normalize spaces
        .trim();
      
      if (cleanedMedicine.length > 3) {
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
