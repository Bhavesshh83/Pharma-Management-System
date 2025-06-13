
import { Medicine } from '@/types';

export const medicines: Medicine[] = [
  // Antibiotics - Common prescription medicines
  {
    id: '1',
    name: 'Amoxicillin',
    description: 'Broad-spectrum antibiotic for bacterial infections',
    price: 85,
    category: 'prescription',
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=300&h=200&fit=crop',
    requires_prescription: true,
    in_stock: true,
    manufacturer: 'GSK',
    rxnorm_code: '723'
  },
  {
    id: '2',
    name: 'Azithromycin',
    description: 'Macrolide antibiotic for respiratory infections',
    price: 125,
    category: 'prescription',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&h=200&fit=crop',
    requires_prescription: true,
    in_stock: true,
    manufacturer: 'Pfizer',
    rxnorm_code: '18631'
  },
  {
    id: '3',
    name: 'Ciprofloxacin',
    description: 'Fluoroquinolone antibiotic for UTI and other infections',
    price: 115,
    category: 'prescription',
    image: 'https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=300&h=200&fit=crop',
    requires_prescription: true,
    in_stock: true,
    manufacturer: 'Bayer',
    rxnorm_code: '2551'
  },
  {
    id: '4',
    name: 'Cephalexin',
    description: 'First-generation cephalosporin antibiotic',
    price: 95,
    category: 'prescription',
    image: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=300&h=200&fit=crop',
    requires_prescription: true,
    in_stock: true,
    manufacturer: 'Teva',
    rxnorm_code: '2176'
  },
  {
    id: '5',
    name: 'Doxycycline',
    description: 'Tetracycline antibiotic for various infections',
    price: 105,
    category: 'prescription',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=300&h=200&fit=crop',
    requires_prescription: true,
    in_stock: true,
    manufacturer: 'Pfizer',
    rxnorm_code: '3640'
  },

  // Pain Relief & Anti-inflammatory
  {
    id: '6',
    name: 'Paracetamol',
    description: 'Pain reliever and fever reducer',
    price: 25,
    category: 'basic',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&h=200&fit=crop',
    requires_prescription: false,
    in_stock: true,
    manufacturer: 'Generic',
    rxnorm_code: '161'
  },
  {
    id: '7',
    name: 'Acetaminophen',
    description: 'Pain reliever and fever reducer (same as Paracetamol)',
    price: 28,
    category: 'basic',
    image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=300&h=200&fit=crop',
    requires_prescription: false,
    in_stock: true,
    manufacturer: 'Tylenol',
    rxnorm_code: '161'
  },
  {
    id: '8',
    name: 'Ibuprofen',
    description: 'Anti-inflammatory pain reliever',
    price: 55,
    category: 'basic',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=300&h=200&fit=crop',
    requires_prescription: false,
    in_stock: true,
    manufacturer: 'Advil',
    rxnorm_code: '5640'
  },
  {
    id: '9',
    name: 'Aspirin',
    description: 'Pain relief and anti-inflammatory',
    price: 30,
    category: 'basic',
    image: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=300&h=200&fit=crop',
    requires_prescription: false,
    in_stock: true,
    manufacturer: 'Bayer',
    rxnorm_code: '1191'
  },
  {
    id: '10',
    name: 'Diclofenac',
    description: 'Non-steroidal anti-inflammatory drug',
    price: 65,
    category: 'prescription',
    image: 'https://images.unsplash.com/photo-1512069772995-ec65bbf3d571?w=300&h=200&fit=crop',
    requires_prescription: true,
    in_stock: true,
    manufacturer: 'Novartis',
    rxnorm_code: '3355'
  },

  // Diabetes Medications
  {
    id: '11',
    name: 'Metformin',
    description: 'Type 2 diabetes medication',
    price: 45,
    category: 'prescription',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&h=200&fit=crop',
    requires_prescription: true,
    in_stock: true,
    manufacturer: 'Bristol Myers',
    rxnorm_code: '6809'
  },
  {
    id: '12',
    name: 'Insulin',
    description: 'Hormone for diabetes management',
    price: 850,
    category: 'prescription',
    image: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=300&h=200&fit=crop',
    requires_prescription: true,
    in_stock: true,
    manufacturer: 'Novo Nordisk',
    rxnorm_code: '5856'
  },
  {
    id: '13',
    name: 'Glipizide',
    description: 'Sulfonylurea for type 2 diabetes',
    price: 75,
    category: 'prescription',
    image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=300&h=200&fit=crop',
    requires_prescription: true,
    in_stock: true,
    manufacturer: 'Pfizer',
    rxnorm_code: '4821'
  },

  // Blood Pressure Medications
  {
    id: '14',
    name: 'Amlodipine',
    description: 'Calcium channel blocker for hypertension',
    price: 65,
    category: 'prescription',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=300&h=200&fit=crop',
    requires_prescription: true,
    in_stock: true,
    manufacturer: 'Pfizer',
    rxnorm_code: '17767'
  },
  {
    id: '15',
    name: 'Lisinopril',
    description: 'ACE inhibitor for blood pressure',
    price: 85,
    category: 'prescription',
    image: 'https://images.unsplash.com/photo-1585435557343-3b092031d637?w=300&h=200&fit=crop',
    requires_prescription: true,
    in_stock: true,
    manufacturer: 'Merck',
    rxnorm_code: '29046'
  },
  {
    id: '16',
    name: 'Losartan',
    description: 'ARB for hypertension',
    price: 75,
    category: 'prescription',
    image: 'https://images.unsplash.com/photo-1512069772995-ec65bbf3d571?w=300&h=200&fit=crop',
    requires_prescription: true,
    in_stock: true,
    manufacturer: 'Merck',
    rxnorm_code: '52175'
  },
  {
    id: '17',
    name: 'Atenolol',
    description: 'Beta-blocker for hypertension',
    price: 55,
    category: 'prescription',
    image: 'https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=300&h=200&fit=crop',
    requires_prescription: true,
    in_stock: true,
    manufacturer: 'AstraZeneca',
    rxnorm_code: '1202'
  },

  // Respiratory Medications
  {
    id: '18',
    name: 'Albuterol',
    description: 'Bronchodilator inhaler for asthma',
    price: 145,
    category: 'prescription',
    image: 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=300&h=200&fit=crop',
    requires_prescription: true,
    in_stock: true,
    manufacturer: 'GSK',
    rxnorm_code: '435'
  },
  {
    id: '19',
    name: 'Prednisolone',
    description: 'Corticosteroid for inflammation',
    price: 65,
    category: 'prescription',
    image: 'https://images.unsplash.com/photo-1628771065518-0d82f1938462?w=300&h=200&fit=crop',
    requires_prescription: true,
    in_stock: true,
    manufacturer: 'Pfizer',
    rxnorm_code: '8640'
  },
  {
    id: '20',
    name: 'Cetirizine',
    description: 'Antihistamine for allergies',
    price: 35,
    category: 'basic',
    image: 'https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=300&h=200&fit=crop',
    requires_prescription: false,
    in_stock: true,
    manufacturer: 'UCB',
    rxnorm_code: '1998'
  },

  // Gastrointestinal Medications
  {
    id: '21',
    name: 'Omeprazole',
    description: 'Proton pump inhibitor for acid reflux',
    price: 55,
    category: 'prescription',
    image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=300&h=200&fit=crop',
    requires_prescription: true,
    in_stock: true,
    manufacturer: 'AstraZeneca',
    rxnorm_code: '7646'
  },
  {
    id: '22',
    name: 'Ranitidine',
    description: 'H2 receptor antagonist for heartburn',
    price: 35,
    category: 'basic',
    image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=300&h=200&fit=crop',
    requires_prescription: false,
    in_stock: true,
    manufacturer: 'GSK',
    rxnorm_code: '9143'
  },
  {
    id: '23',
    name: 'Pantoprazole',
    description: 'Proton pump inhibitor',
    price: 68,
    category: 'prescription',
    image: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=300&h=200&fit=crop',
    requires_prescription: true,
    in_stock: true,
    manufacturer: 'Wyeth',
    rxnorm_code: '40790'
  },

  // Mental Health Medications
  {
    id: '24',
    name: 'Sertraline',
    description: 'SSRI antidepressant',
    price: 95,
    category: 'prescription',
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=300&h=200&fit=crop',
    requires_prescription: true,
    in_stock: true,
    manufacturer: 'Pfizer',
    rxnorm_code: '36437'
  },
  {
    id: '25',
    name: 'Fluoxetine',
    description: 'SSRI antidepressant (Prozac)',
    price: 85,
    category: 'prescription',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&h=200&fit=crop',
    requires_prescription: true,
    in_stock: true,
    manufacturer: 'Eli Lilly',
    rxnorm_code: '4493'
  },
  {
    id: '26',
    name: 'Lorazepam',
    description: 'Benzodiazepine for anxiety',
    price: 75,
    category: 'prescription',
    image: 'https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=300&h=200&fit=crop',
    requires_prescription: true,
    in_stock: true,
    manufacturer: 'Wyeth',
    rxnorm_code: '6470'
  },

  // Cholesterol Medications
  {
    id: '27',
    name: 'Atorvastatin',
    description: 'Statin for cholesterol management',
    price: 95,
    category: 'prescription',
    image: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=300&h=200&fit=crop',
    requires_prescription: true,
    in_stock: true,
    manufacturer: 'Pfizer',
    rxnorm_code: '83367'
  },
  {
    id: '28',
    name: 'Simvastatin',
    description: 'Statin for high cholesterol',
    price: 85,
    category: 'prescription',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=300&h=200&fit=crop',
    requires_prescription: true,
    in_stock: true,
    manufacturer: 'Merck',
    rxnorm_code: '36567'
  },

  // Thyroid Medications
  {
    id: '29',
    name: 'Levothyroxine',
    description: 'Thyroid hormone replacement',
    price: 75,
    category: 'prescription',
    image: 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=300&h=200&fit=crop',
    requires_prescription: true,
    in_stock: true,
    manufacturer: 'Abbott',
    rxnorm_code: '10582'
  },

  // Anti-seizure Medications
  {
    id: '30',
    name: 'Phenytoin',
    description: 'Anticonvulsant for epilepsy',
    price: 125,
    category: 'prescription',
    image: 'https://images.unsplash.com/photo-1550572017-edd951b55104?w=300&h=200&fit=crop',
    requires_prescription: true,
    in_stock: true,
    manufacturer: 'Pfizer',
    rxnorm_code: '8134'
  },

  // Blood Thinners
  {
    id: '31',
    name: 'Warfarin',
    description: 'Anticoagulant blood thinner',
    price: 105,
    category: 'prescription',
    image: 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=300&h=200&fit=crop',
    requires_prescription: true,
    in_stock: true,
    manufacturer: 'Bristol Myers',
    rxnorm_code: '11289'
  },

  // Common Indian Brand Names
  {
    id: '32',
    name: 'Dolo 650',
    description: 'Paracetamol 650mg tablet',
    price: 45,
    category: 'basic',
    image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=300&h=200&fit=crop',
    requires_prescription: false,
    in_stock: true,
    manufacturer: 'Micro Labs',
    rxnorm_code: '161'
  },
  {
    id: '33',
    name: 'Crocin',
    description: 'Paracetamol for fever and pain',
    price: 35,
    category: 'basic',
    image: 'https://images.unsplash.com/photo-1550572017-edd951b55104?w=300&h=200&fit=crop',
    requires_prescription: false,
    in_stock: true,
    manufacturer: 'GSK',
    rxnorm_code: '161'
  },
  {
    id: '34',
    name: 'Combiflam',
    description: 'Ibuprofen + Paracetamol combination',
    price: 42,
    category: 'basic',
    image: 'https://images.unsplash.com/photo-1512069772995-ec65bbf3d571?w=300&h=200&fit=crop',
    requires_prescription: false,
    in_stock: true,
    manufacturer: 'Sanofi',
    rxnorm_code: '5640'
  },
  {
    id: '35',
    name: 'Azee 500',
    description: 'Azithromycin 500mg tablet',
    price: 135,
    category: 'prescription',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&h=200&fit=crop',
    requires_prescription: true,
    in_stock: true,
    manufacturer: 'Cipla',
    rxnorm_code: '18631'
  },

  // Cough and Cold
  {
    id: '36',
    name: 'Benadryl Cough Syrup',
    description: 'Cough suppressant syrup',
    price: 85,
    category: 'cough',
    image: 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=300&h=200&fit=crop',
    requires_prescription: false,
    in_stock: true,
    manufacturer: 'Johnson & Johnson',
    rxnorm_code: '1149'
  },
  {
    id: '37',
    name: 'Ascoril LS',
    description: 'Expectorant cough syrup',
    price: 95,
    category: 'cough',
    image: 'https://images.unsplash.com/photo-1585435557343-3b092031d637?w=300&h=200&fit=crop',
    requires_prescription: false,
    in_stock: true,
    manufacturer: 'Glenmark',
    rxnorm_code: '1536'
  },

  // Vitamins and Supplements
  {
    id: '38',
    name: 'Vitamin D3',
    description: 'Cholecalciferol supplement',
    price: 95,
    category: 'energy',
    image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=300&h=200&fit=crop',
    requires_prescription: false,
    in_stock: true,
    manufacturer: 'Sun Pharma',
    rxnorm_code: '1158'
  },
  {
    id: '39',
    name: 'B Complex',
    description: 'Vitamin B complex tablets',
    price: 85,
    category: 'energy',
    image: 'https://images.unsplash.com/photo-1550572017-edd951b55104?w=300&h=200&fit=crop',
    requires_prescription: false,
    in_stock: true,
    manufacturer: 'Mankind',
    rxnorm_code: '2551'
  },
  {
    id: '40',
    name: 'Calcium Carbonate',
    description: 'Calcium supplement for bone health',
    price: 115,
    category: 'energy',
    image: 'https://images.unsplash.com/photo-1550572017-edd951b55104?w=300&h=200&fit=crop',
    requires_prescription: false,
    in_stock: true,
    manufacturer: 'Cipla',
    rxnorm_code: '1819'
  },

  // More commonly prescribed medicines
  {
    id: '41',
    name: 'Clarithromycin',
    description: 'Macrolide antibiotic',
    price: 145,
    category: 'prescription',
    image: 'https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=300&h=200&fit=crop',
    requires_prescription: true,
    in_stock: true,
    manufacturer: 'Abbott',
    rxnorm_code: '21212'
  },
  {
    id: '42',
    name: 'Prednisone',
    description: 'Corticosteroid anti-inflammatory',
    price: 75,
    category: 'prescription',
    image: 'https://images.unsplash.com/photo-1628771065518-0d82f1938462?w=300&h=200&fit=crop',
    requires_prescription: true,
    in_stock: true,
    manufacturer: 'Pfizer',
    rxnorm_code: '8638'
  },
  {
    id: '43',
    name: 'Tramadol',
    description: 'Opioid pain medication',
    price: 165,
    category: 'prescription',
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=300&h=200&fit=crop',
    requires_prescription: true,
    in_stock: true,
    manufacturer: 'Janssen',
    rxnorm_code: '10689'
  },
  {
    id: '44',
    name: 'Gabapentin',
    description: 'Anticonvulsant for nerve pain',
    price: 125,
    category: 'prescription',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&h=200&fit=crop',
    requires_prescription: true,
    in_stock: true,
    manufacturer: 'Pfizer',
    rxnorm_code: '4687'
  },
  {
    id: '45',
    name: 'Hydrochlorothiazide',
    description: 'Diuretic for blood pressure',
    price: 55,
    category: 'prescription',
    image: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=300&h=200&fit=crop',
    requires_prescription: true,
    in_stock: true,
    manufacturer: 'Merck',
    rxnorm_code: '5487'
  }
];
