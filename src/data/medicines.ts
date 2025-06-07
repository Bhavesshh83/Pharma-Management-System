
import { Medicine } from '@/types';

export const medicines: Medicine[] = [
  // Basic Medicines
  {
    id: '1',
    name: 'Paracetamol 500mg',
    description: 'Pain reliever and fever reducer',
    price: 25,
    category: 'basic',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&h=200&fit=crop',
    requires_prescription: false,
    in_stock: true,
    manufacturer: 'Generic Pharma'
  },
  {
    id: '2',
    name: 'Dolo 650mg',
    description: 'Paracetamol for fever and pain relief',
    price: 45,
    category: 'basic',
    image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=300&h=200&fit=crop',
    requires_prescription: false,
    in_stock: true,
    manufacturer: 'Micro Labs'
  },
  {
    id: '3',
    name: 'Aspirin 300mg',
    description: 'Pain relief and anti-inflammatory',
    price: 30,
    category: 'basic',
    image: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=300&h=200&fit=crop',
    requires_prescription: false,
    in_stock: true,
    manufacturer: 'Bayer'
  },
  {
    id: '4',
    name: 'Ibuprofen 400mg',
    description: 'Anti-inflammatory and pain reliever',
    price: 55,
    category: 'basic',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=300&h=200&fit=crop',
    requires_prescription: false,
    in_stock: true,
    manufacturer: 'Abbott'
  },
  {
    id: '5',
    name: 'Crocin Advance',
    description: 'Fast acting fever and pain relief',
    price: 35,
    category: 'basic',
    image: 'https://images.unsplash.com/photo-1550572017-edd951b55104?w=300&h=200&fit=crop',
    requires_prescription: false,
    in_stock: true,
    manufacturer: 'GSK'
  },
  {
    id: '6',
    name: 'Diclofenac Sodium 50mg',
    description: 'Anti-inflammatory pain reliever',
    price: 65,
    category: 'basic',
    image: 'https://images.unsplash.com/photo-1512069772995-ec65bbf3d571?w=300&h=200&fit=crop',
    requires_prescription: false,
    in_stock: true,
    manufacturer: 'Novartis'
  },
  {
    id: '7',
    name: 'Cetirizine 10mg',
    description: 'Antihistamine for allergies',
    price: 35,
    category: 'basic',
    image: 'https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=300&h=200&fit=crop',
    requires_prescription: false,
    in_stock: true,
    manufacturer: 'UCB Pharma'
  },
  {
    id: '8',
    name: 'Loperamide 2mg',
    description: 'Anti-diarrheal medication',
    price: 45,
    category: 'basic',
    image: 'https://images.unsplash.com/photo-1559181567-c3190ca9959b?w=300&h=200&fit=crop',
    requires_prescription: false,
    in_stock: true,
    manufacturer: 'Johnson & Johnson'
  },
  
  // Headache Medicines
  {
    id: '9',
    name: 'Saridon Advanced',
    description: 'Fast relief from headache',
    price: 35,
    category: 'headache',
    image: 'https://images.unsplash.com/photo-1563213126-a4273aed2016?w=300&h=200&fit=crop',
    requires_prescription: false,
    in_stock: true,
    manufacturer: 'Piramal Healthcare'
  },
  {
    id: '10',
    name: 'Anacin Extra',
    description: 'Relief from severe headaches',
    price: 28,
    category: 'headache',
    image: 'https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=300&h=200&fit=crop',
    requires_prescription: false,
    in_stock: true,
    manufacturer: 'Pfizer'
  },
  {
    id: '11',
    name: 'Combiflam',
    description: 'For headache and body pain',
    price: 42,
    category: 'headache',
    image: 'https://images.unsplash.com/photo-1512069772995-ec65bbf3d571?w=300&h=200&fit=crop',
    requires_prescription: false,
    in_stock: true,
    manufacturer: 'Sanofi'
  },
  {
    id: '12',
    name: 'Disprin Regular',
    description: 'Quick headache relief',
    price: 18,
    category: 'headache',
    image: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=300&h=200&fit=crop',
    requires_prescription: false,
    in_stock: true,
    manufacturer: 'Reckitt Benckiser'
  },
  {
    id: '13',
    name: 'Excedrin Migraine',
    description: 'Migraine specific relief',
    price: 65,
    category: 'headache',
    image: 'https://images.unsplash.com/photo-1559181567-c3190ca9959b?w=300&h=200&fit=crop',
    requires_prescription: false,
    in_stock: true,
    manufacturer: 'Haleon'
  },
  {
    id: '14',
    name: 'Sumatriptan 50mg',
    description: 'Prescription migraine treatment',
    price: 85,
    category: 'headache',
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=300&h=200&fit=crop',
    requires_prescription: true,
    in_stock: true,
    manufacturer: 'GSK'
  },
  
  // Cough and Cold Medicines
  {
    id: '15',
    name: 'Benadryl Cough Syrup',
    description: 'Dry cough relief syrup',
    price: 85,
    category: 'cough',
    image: 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=300&h=200&fit=crop',
    requires_prescription: false,
    in_stock: true,
    manufacturer: 'Johnson & Johnson'
  },
  {
    id: '16',
    name: 'Honitus Cough Drops',
    description: 'Herbal cough drops',
    price: 15,
    category: 'cough',
    image: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=300&h=200&fit=crop',
    requires_prescription: false,
    in_stock: true,
    manufacturer: 'Dabur'
  },
  {
    id: '17',
    name: 'Vicks Cough Drops',
    description: 'Menthol based cough relief',
    price: 12,
    category: 'cough',
    image: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=300&h=200&fit=crop',
    requires_prescription: false,
    in_stock: true,
    manufacturer: 'Procter & Gamble'
  },
  {
    id: '18',
    name: 'Ascoril LS Syrup',
    description: 'Productive cough relief',
    price: 95,
    category: 'cough',
    image: 'https://images.unsplash.com/photo-1585435557343-3b092031d637?w=300&h=200&fit=crop',
    requires_prescription: false,
    in_stock: true,
    manufacturer: 'Glenmark'
  },
  {
    id: '19',
    name: 'Alex Cough Syrup',
    description: 'Relief from wet and dry cough',
    price: 78,
    category: 'cough',
    image: 'https://images.unsplash.com/photo-1628771065518-0d82f1938462?w=300&h=200&fit=crop',
    requires_prescription: false,
    in_stock: true,
    manufacturer: 'Ranbaxy'
  },
  {
    id: '20',
    name: 'Strepsils Lozenges',
    description: 'Sore throat and cough relief',
    price: 25,
    category: 'cough',
    image: 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=300&h=200&fit=crop',
    requires_prescription: false,
    in_stock: true,
    manufacturer: 'Reckitt Benckiser'
  },
  {
    id: '21',
    name: 'Vicks VapoRub',
    description: 'Topical cough suppressant',
    price: 55,
    category: 'cough',
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=200&fit=crop',
    requires_prescription: false,
    in_stock: true,
    manufacturer: 'Procter & Gamble'
  },
  {
    id: '22',
    name: 'Sinarest Tablet',
    description: 'Cold and sinus relief',
    price: 45,
    category: 'cough',
    image: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=300&h=200&fit=crop',
    requires_prescription: false,
    in_stock: true,
    manufacturer: 'Centaur Pharma'
  },
  {
    id: '23',
    name: 'Coldact Capsule',
    description: 'Multi-symptom cold relief',
    price: 38,
    category: 'cough',
    image: 'https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=300&h=200&fit=crop',
    requires_prescription: false,
    in_stock: true,
    manufacturer: 'Sanofi'
  },
  {
    id: '24',
    name: 'Otrivin Nasal Spray',
    description: 'Nasal congestion relief',
    price: 125,
    category: 'cough',
    image: 'https://images.unsplash.com/photo-1562736537-cec2d03fa71c?w=300&h=200&fit=crop',
    requires_prescription: false,
    in_stock: true,
    manufacturer: 'Novartis'
  },
  
  // Energy and Hydration Products
  {
    id: '25',
    name: 'Electral Powder',
    description: 'Oral rehydration salts',
    price: 25,
    category: 'energy',
    image: 'https://images.unsplash.com/photo-1562736537-cec2d03fa71c?w=300&h=200&fit=crop',
    requires_prescription: false,
    in_stock: true,
    manufacturer: 'FDC Limited'
  },
  {
    id: '26',
    name: 'ORS Solution',
    description: 'World Health Organization formula',
    price: 20,
    category: 'energy',
    image: 'https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=300&h=200&fit=crop',
    requires_prescription: false,
    in_stock: true,
    manufacturer: 'Cipla'
  },
  {
    id: '27',
    name: 'Glucon-D Orange',
    description: 'Energy drink powder with vitamin D',
    price: 55,
    category: 'energy',
    image: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=300&h=200&fit=crop',
    requires_prescription: false,
    in_stock: true,
    manufacturer: 'Heinz India'
  },
  {
    id: '28',
    name: 'Enerzal Powder',
    description: 'Instant energy and electrolyte replacement',
    price: 45,
    category: 'energy',
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=200&fit=crop',
    requires_prescription: false,
    in_stock: true,
    manufacturer: 'Raptakos Brett'
  },
  {
    id: '29',
    name: 'B-Complex Tablets',
    description: 'Vitamin B complex for energy',
    price: 85,
    category: 'energy',
    image: 'https://images.unsplash.com/photo-1550572017-edd951b55104?w=300&h=200&fit=crop',
    requires_prescription: false,
    in_stock: true,
    manufacturer: 'Mankind Pharma'
  },
  {
    id: '30',
    name: 'Revital H Capsules',
    description: 'Daily health supplement',
    price: 125,
    category: 'energy',
    image: 'https://images.unsplash.com/photo-1559181567-c3190ca9959b?w=300&h=200&fit=crop',
    requires_prescription: false,
    in_stock: true,
    manufacturer: 'Ranbaxy'
  },
  {
    id: '31',
    name: 'Vitamin C 500mg',
    description: 'Immune system support',
    price: 75,
    category: 'energy',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&h=200&fit=crop',
    requires_prescription: false,
    in_stock: true,
    manufacturer: 'Nature Made'
  },
  {
    id: '32',
    name: 'Vitamin D3 1000 IU',
    description: 'Bone health and immunity',
    price: 95,
    category: 'energy',
    image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=300&h=200&fit=crop',
    requires_prescription: false,
    in_stock: true,
    manufacturer: 'Sun Pharma'
  },
  {
    id: '33',
    name: 'Multivitamin Tablets',
    description: 'Complete daily nutrition',
    price: 145,
    category: 'energy',
    image: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=300&h=200&fit=crop',
    requires_prescription: false,
    in_stock: true,
    manufacturer: 'Centrum'
  },
  {
    id: '34',
    name: 'Iron Tablets 65mg',
    description: 'Iron deficiency anemia treatment',
    price: 65,
    category: 'energy',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=300&h=200&fit=crop',
    requires_prescription: false,
    in_stock: true,
    manufacturer: 'Abbott'
  },
  {
    id: '35',
    name: 'Calcium + D3 Tablets',
    description: 'Bone strength and health',
    price: 115,
    category: 'energy',
    image: 'https://images.unsplash.com/photo-1550572017-edd951b55104?w=300&h=200&fit=crop',
    requires_prescription: false,
    in_stock: true,
    manufacturer: 'Cipla'
  },
  
  // Prescription Medicines
  {
    id: '36',
    name: 'Azithromycin 500mg',
    description: 'Antibiotic for bacterial infections',
    price: 125,
    category: 'prescription',
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=300&h=200&fit=crop',
    requires_prescription: true,
    in_stock: true,
    manufacturer: 'Sun Pharma'
  },
  {
    id: '37',
    name: 'Metformin 500mg',
    description: 'Diabetes medication',
    price: 45,
    category: 'prescription',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&h=200&fit=crop',
    requires_prescription: true,
    in_stock: true,
    manufacturer: 'Lupin'
  },
  {
    id: '38',
    name: 'Amoxicillin 250mg',
    description: 'Broad-spectrum antibiotic',
    price: 85,
    category: 'prescription',
    image: 'https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=300&h=200&fit=crop',
    requires_prescription: true,
    in_stock: true,
    manufacturer: 'Ranbaxy'
  },
  {
    id: '39',
    name: 'Atorvastatin 20mg',
    description: 'Cholesterol lowering medication',
    price: 95,
    category: 'prescription',
    image: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=300&h=200&fit=crop',
    requires_prescription: true,
    in_stock: true,
    manufacturer: 'Pfizer'
  },
  {
    id: '40',
    name: 'Amlodipine 5mg',
    description: 'Blood pressure medication',
    price: 65,
    category: 'prescription',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=300&h=200&fit=crop',
    requires_prescription: true,
    in_stock: true,
    manufacturer: 'Cipla'
  },
  {
    id: '41',
    name: 'Omeprazole 20mg',
    description: 'Acid reflux and ulcer treatment',
    price: 55,
    category: 'prescription',
    image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=300&h=200&fit=crop',
    requires_prescription: true,
    in_stock: true,
    manufacturer: 'Dr. Reddy\'s'
  },
  {
    id: '42',
    name: 'Losartan 50mg',
    description: 'Hypertension medication',
    price: 75,
    category: 'prescription',
    image: 'https://images.unsplash.com/photo-1512069772995-ec65bbf3d571?w=300&h=200&fit=crop',
    requires_prescription: true,
    in_stock: true,
    manufacturer: 'Merck'
  },
  {
    id: '43',
    name: 'Ciprofloxacin 500mg',
    description: 'Fluoroquinolone antibiotic',
    price: 115,
    category: 'prescription',
    image: 'https://images.unsplash.com/photo-1563213126-a4273aed2016?w=300&h=200&fit=crop',
    requires_prescription: true,
    in_stock: true,
    manufacturer: 'Bayer'
  },
  {
    id: '44',
    name: 'Prednisolone 10mg',
    description: 'Corticosteroid for inflammation',
    price: 65,
    category: 'prescription',
    image: 'https://images.unsplash.com/photo-1628771065518-0d82f1938462?w=300&h=200&fit=crop',
    requires_prescription: true,
    in_stock: true,
    manufacturer: 'Wyeth'
  },
  {
    id: '45',
    name: 'Lisinopril 10mg',
    description: 'ACE inhibitor for blood pressure',
    price: 85,
    category: 'prescription',
    image: 'https://images.unsplash.com/photo-1585435557343-3b092031d637?w=300&h=200&fit=crop',
    requires_prescription: true,
    in_stock: true,
    manufacturer: 'Prinivil'
  },
  {
    id: '46',
    name: 'Warfarin 5mg',
    description: 'Blood thinner medication',
    price: 105,
    category: 'prescription',
    image: 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=300&h=200&fit=crop',
    requires_prescription: true,
    in_stock: true,
    manufacturer: 'Bristol Myers'
  },
  {
    id: '47',
    name: 'Insulin Glargine',
    description: 'Long-acting diabetes insulin',
    price: 850,
    category: 'prescription',
    image: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=300&h=200&fit=crop',
    requires_prescription: true,
    in_stock: true,
    manufacturer: 'Sanofi'
  },
  {
    id: '48',
    name: 'Levothyroxine 50mcg',
    description: 'Thyroid hormone replacement',
    price: 75,
    category: 'prescription',
    image: 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=300&h=200&fit=crop',
    requires_prescription: true,
    in_stock: true,
    manufacturer: 'Abbott'
  },
  
  // Salines and IV Solutions
  {
    id: '49',
    name: 'Normal Saline 500ml',
    description: '0.9% Sodium Chloride IV solution',
    price: 45,
    category: 'basic',
    image: 'https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?w=300&h=200&fit=crop',
    requires_prescription: false,
    in_stock: true,
    manufacturer: 'Baxter'
  },
  {
    id: '50',
    name: 'Dextrose Saline 500ml',
    description: '5% Dextrose in Normal Saline',
    price: 55,
    category: 'basic',
    image: 'https://images.unsplash.com/photo-1493962853295-0fd70327578a?w=300&h=200&fit=crop',
    requires_prescription: false,
    in_stock: true,
    manufacturer: 'Fresenius Kabi'
  },
  {
    id: '51',
    name: 'Ringer Lactate 500ml',
    description: 'Balanced electrolyte solution',
    price: 50,
    category: 'basic',
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=200&fit=crop',
    requires_prescription: false,
    in_stock: true,
    manufacturer: 'B. Braun'
  },
  {
    id: '52',
    name: 'DNS 500ml',
    description: '5% Dextrose in Normal Saline',
    price: 48,
    category: 'basic',
    image: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=300&h=200&fit=crop',
    requires_prescription: false,
    in_stock: true,
    manufacturer: 'Otsuka'
  },
  {
    id: '53',
    name: 'Saline Nasal Drops',
    description: 'Natural nasal congestion relief',
    price: 35,
    category: 'basic',
    image: 'https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=300&h=200&fit=crop',
    requires_prescription: false,
    in_stock: true,
    manufacturer: 'Ayr'
  },
  {
    id: '54',
    name: 'Mannitol 20% 100ml',
    description: 'Osmotic diuretic solution',
    price: 125,
    category: 'prescription',
    image: 'https://images.unsplash.com/photo-1562736537-cec2d03fa71c?w=300&h=200&fit=crop',
    requires_prescription: true,
    in_stock: true,
    manufacturer: 'Hospira'
  },
  
  // Additional Common Medicines
  {
    id: '55',
    name: 'Domperidone 10mg',
    description: 'Anti-nausea and vomiting',
    price: 45,
    category: 'basic',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&h=200&fit=crop',
    requires_prescription: false,
    in_stock: true,
    manufacturer: 'Cipla'
  },
  {
    id: '56',
    name: 'Ranitidine 150mg',
    description: 'Acid reducer for heartburn',
    price: 35,
    category: 'basic',
    image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=300&h=200&fit=crop',
    requires_prescription: false,
    in_stock: true,
    manufacturer: 'GSK'
  },
  {
    id: '57',
    name: 'Betadine Solution',
    description: 'Antiseptic wound cleaner',
    price: 65,
    category: 'basic',
    image: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=300&h=200&fit=crop',
    requires_prescription: false,
    in_stock: true,
    manufacturer: 'Mundipharma'
  },
  {
    id: '58',
    name: 'Hydrogen Peroxide 3%',
    description: 'Antiseptic and wound cleaner',
    price: 25,
    category: 'basic',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=300&h=200&fit=crop',
    requires_prescription: false,
    in_stock: true,
    manufacturer: 'CVS Health'
  },
  {
    id: '59',
    name: 'Thermometer Digital',
    description: 'Digital fever thermometer',
    price: 250,
    category: 'basic',
    image: 'https://images.unsplash.com/photo-1550572017-edd951b55104?w=300&h=200&fit=crop',
    requires_prescription: false,
    in_stock: true,
    manufacturer: 'Omron'
  },
  {
    id: '60',
    name: 'BP Monitor Digital',
    description: 'Digital blood pressure monitor',
    price: 1250,
    category: 'basic',
    image: 'https://images.unsplash.com/photo-1512069772995-ec65bbf3d571?w=300&h=200&fit=crop',
    requires_prescription: false,
    in_stock: true,
    manufacturer: 'Omron'
  },
  {
    id: '61',
    name: 'Glucose Test Strips',
    description: 'Blood glucose monitoring strips',
    price: 350,
    category: 'basic',
    image: 'https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=300&h=200&fit=crop',
    requires_prescription: false,
    in_stock: true,
    manufacturer: 'Accu-Chek'
  },
  {
    id: '62',
    name: 'Surgical Mask Box',
    description: '50 pieces surgical masks',
    price: 125,
    category: 'basic',
    image: 'https://images.unsplash.com/photo-1563213126-a4273aed2016?w=300&h=200&fit=crop',
    requires_prescription: false,
    in_stock: true,
    manufacturer: '3M'
  },
  {
    id: '63',
    name: 'Hand Sanitizer 500ml',
    description: '70% alcohol hand sanitizer',
    price: 85,
    category: 'basic',
    image: 'https://images.unsplash.com/photo-1628771065518-0d82f1938462?w=300&h=200&fit=crop',
    requires_prescription: false,
    in_stock: true,
    manufacturer: 'Purell'
  },
  {
    id: '64',
    name: 'Bandages Assorted',
    description: 'Various sizes adhesive bandages',
    price: 45,
    category: 'basic',
    image: 'https://images.unsplash.com/photo-1585435557343-3b092031d637?w=300&h=200&fit=crop',
    requires_prescription: false,
    in_stock: true,
    manufacturer: 'Band-Aid'
  },
  {
    id: '65',
    name: 'Cotton Balls 100g',
    description: 'Sterile cotton balls',
    price: 35,
    category: 'basic',
    image: 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=300&h=200&fit=crop',
    requires_prescription: false,
    in_stock: true,
    manufacturer: 'Johnson & Johnson'
  },
  {
    id: '66',
    name: 'Syringes 5ml (10 Pack)',
    description: 'Disposable medical syringes',
    price: 65,
    category: 'basic',
    image: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=300&h=200&fit=crop',
    requires_prescription: false,
    in_stock: true,
    manufacturer: 'BD'
  },
  {
    id: '67',
    name: 'Elastic Bandage',
    description: 'Compression bandage for sprains',
    price: 55,
    category: 'basic',
    image: 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=300&h=200&fit=crop',
    requires_prescription: false,
    in_stock: true,
    manufacturer: 'ACE'
  },
  {
    id: '68',
    name: 'Eye Drops Refresh',
    description: 'Artificial tears for dry eyes',
    price: 85,
    category: 'basic',
    image: 'https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?w=300&h=200&fit=crop',
    requires_prescription: false,
    in_stock: true,
    manufacturer: 'Allergan'
  },
  {
    id: '69',
    name: 'Antacid Tablets',
    description: 'Quick relief from acidity',
    price: 25,
    category: 'basic',
    image: 'https://images.unsplash.com/photo-1493962853295-0fd70327578a?w=300&h=200&fit=crop',
    requires_prescription: false,
    in_stock: true,
    manufacturer: 'Tums'
  },
  {
    id: '70',
    name: 'Probiotic Capsules',
    description: 'Digestive health supplement',
    price: 145,
    category: 'energy',
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=200&fit=crop',
    requires_prescription: false,
    in_stock: true,
    manufacturer: 'Align'
  }
];
