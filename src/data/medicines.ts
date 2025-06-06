
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
    requiresPrescription: false,
    inStock: true,
    manufacturer: 'Generic Pharma'
  },
  {
    id: '2',
    name: 'Dolo 650mg',
    description: 'Paracetamol for fever and pain relief',
    price: 45,
    category: 'basic',
    image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=300&h=200&fit=crop',
    requiresPrescription: false,
    inStock: true,
    manufacturer: 'Micro Labs'
  },
  {
    id: '3',
    name: 'Aspirin 300mg',
    description: 'Pain relief and anti-inflammatory',
    price: 30,
    category: 'basic',
    image: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=300&h=200&fit=crop',
    requiresPrescription: false,
    inStock: true,
    manufacturer: 'Bayer'
  },
  {
    id: '4',
    name: 'Ibuprofen 400mg',
    description: 'Anti-inflammatory and pain reliever',
    price: 55,
    category: 'basic',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=300&h=200&fit=crop',
    requiresPrescription: false,
    inStock: true,
    manufacturer: 'Abbott'
  },
  {
    id: '5',
    name: 'Crocin Advance',
    description: 'Fast acting fever and pain relief',
    price: 35,
    category: 'basic',
    image: 'https://images.unsplash.com/photo-1550572017-edd951b55104?w=300&h=200&fit=crop',
    requiresPrescription: false,
    inStock: true,
    manufacturer: 'GSK'
  },
  
  // Headache Medicines
  {
    id: '6',
    name: 'Saridon Advanced',
    description: 'Fast relief from headache',
    price: 35,
    category: 'headache',
    image: 'https://images.unsplash.com/photo-1563213126-a4273aed2016?w=300&h=200&fit=crop',
    requiresPrescription: false,
    inStock: true,
    manufacturer: 'Piramal Healthcare'
  },
  {
    id: '7',
    name: 'Anacin Extra',
    description: 'Relief from severe headaches',
    price: 28,
    category: 'headache',
    image: 'https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=300&h=200&fit=crop',
    requiresPrescription: false,
    inStock: true,
    manufacturer: 'Pfizer'
  },
  {
    id: '8',
    name: 'Combiflam',
    description: 'For headache and body pain',
    price: 42,
    category: 'headache',
    image: 'https://images.unsplash.com/photo-1512069772995-ec65bbf3d571?w=300&h=200&fit=crop',
    requiresPrescription: false,
    inStock: true,
    manufacturer: 'Sanofi'
  },
  {
    id: '9',
    name: 'Disprin Regular',
    description: 'Quick headache relief',
    price: 18,
    category: 'headache',
    image: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=300&h=200&fit=crop',
    requiresPrescription: false,
    inStock: true,
    manufacturer: 'Reckitt Benckiser'
  },
  {
    id: '10',
    name: 'Excedrin Migraine',
    description: 'Migraine specific relief',
    price: 65,
    category: 'headache',
    image: 'https://images.unsplash.com/photo-1559181567-c3190ca9959b?w=300&h=200&fit=crop',
    requiresPrescription: false,
    inStock: true,
    manufacturer: 'Haleon'
  },
  
  // Cough Medicines
  {
    id: '11',
    name: 'Benadryl Cough Syrup',
    description: 'Dry cough relief syrup',
    price: 85,
    category: 'cough',
    image: 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=300&h=200&fit=crop',
    requiresPrescription: false,
    inStock: true,
    manufacturer: 'Johnson & Johnson'
  },
  {
    id: '12',
    name: 'Honitus Cough Drops',
    description: 'Herbal cough drops',
    price: 15,
    category: 'cough',
    image: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=300&h=200&fit=crop',
    requiresPrescription: false,
    inStock: true,
    manufacturer: 'Dabur'
  },
  {
    id: '13',
    name: 'Vicks Cough Drops',
    description: 'Menthol based cough relief',
    price: 12,
    category: 'cough',
    image: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=300&h=200&fit=crop',
    requiresPrescription: false,
    inStock: true,
    manufacturer: 'Procter & Gamble'
  },
  {
    id: '14',
    name: 'Ascoril LS Syrup',
    description: 'Productive cough relief',
    price: 95,
    category: 'cough',
    image: 'https://images.unsplash.com/photo-1585435557343-3b092031d637?w=300&h=200&fit=crop',
    requiresPrescription: false,
    inStock: true,
    manufacturer: 'Glenmark'
  },
  {
    id: '15',
    name: 'Alex Cough Syrup',
    description: 'Relief from wet and dry cough',
    price: 78,
    category: 'cough',
    image: 'https://images.unsplash.com/photo-1628771065518-0d82f1938462?w=300&h=200&fit=crop',
    requiresPrescription: false,
    inStock: true,
    manufacturer: 'Ranbaxy'
  },
  {
    id: '16',
    name: 'Strepsils Lozenges',
    description: 'Sore throat and cough relief',
    price: 25,
    category: 'cough',
    image: 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=300&h=200&fit=crop',
    requiresPrescription: false,
    inStock: true,
    manufacturer: 'Reckitt Benckiser'
  },
  
  // Energy Products
  {
    id: '17',
    name: 'Electral Powder',
    description: 'Oral rehydration salts',
    price: 25,
    category: 'energy',
    image: 'https://images.unsplash.com/photo-1562736537-cec2d03fa71c?w=300&h=200&fit=crop',
    requiresPrescription: false,
    inStock: true,
    manufacturer: 'FDC Limited'
  },
  {
    id: '18',
    name: 'ORS Solution',
    description: 'World Health Organization formula',
    price: 20,
    category: 'energy',
    image: 'https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=300&h=200&fit=crop',
    requiresPrescription: false,
    inStock: true,
    manufacturer: 'Cipla'
  },
  {
    id: '19',
    name: 'Glucon-D Orange',
    description: 'Energy drink powder with vitamin D',
    price: 55,
    category: 'energy',
    image: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=300&h=200&fit=crop',
    requiresPrescription: false,
    inStock: true,
    manufacturer: 'Heinz India'
  },
  {
    id: '20',
    name: 'Enerzal Powder',
    description: 'Instant energy and electrolyte replacement',
    price: 45,
    category: 'energy',
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=200&fit=crop',
    requiresPrescription: false,
    inStock: true,
    manufacturer: 'Raptakos Brett'
  },
  {
    id: '21',
    name: 'B-Complex Tablets',
    description: 'Vitamin B complex for energy',
    price: 85,
    category: 'energy',
    image: 'https://images.unsplash.com/photo-1550572017-edd951b55104?w=300&h=200&fit=crop',
    requiresPrescription: false,
    inStock: true,
    manufacturer: 'Mankind Pharma'
  },
  {
    id: '22',
    name: 'Revital H Capsules',
    description: 'Daily health supplement',
    price: 125,
    category: 'energy',
    image: 'https://images.unsplash.com/photo-1559181567-c3190ca9959b?w=300&h=200&fit=crop',
    requiresPrescription: false,
    inStock: true,
    manufacturer: 'Ranbaxy'
  },
  
  // Prescription Medicines
  {
    id: '23',
    name: 'Azithromycin 500mg',
    description: 'Antibiotic for bacterial infections',
    price: 125,
    category: 'prescription',
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=300&h=200&fit=crop',
    requiresPrescription: true,
    inStock: true,
    manufacturer: 'Sun Pharma'
  },
  {
    id: '24',
    name: 'Metformin 500mg',
    description: 'Diabetes medication',
    price: 45,
    category: 'prescription',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&h=200&fit=crop',
    requiresPrescription: true,
    inStock: true,
    manufacturer: 'Lupin'
  },
  {
    id: '25',
    name: 'Amoxicillin 250mg',
    description: 'Broad-spectrum antibiotic',
    price: 85,
    category: 'prescription',
    image: 'https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=300&h=200&fit=crop',
    requiresPrescription: true,
    inStock: true,
    manufacturer: 'Ranbaxy'
  },
  {
    id: '26',
    name: 'Atorvastatin 20mg',
    description: 'Cholesterol lowering medication',
    price: 95,
    category: 'prescription',
    image: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=300&h=200&fit=crop',
    requiresPrescription: true,
    inStock: true,
    manufacturer: 'Pfizer'
  },
  {
    id: '27',
    name: 'Amlodipine 5mg',
    description: 'Blood pressure medication',
    price: 65,
    category: 'prescription',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=300&h=200&fit=crop',
    requiresPrescription: true,
    inStock: true,
    manufacturer: 'Cipla'
  },
  {
    id: '28',
    name: 'Omeprazole 20mg',
    description: 'Acid reflux and ulcer treatment',
    price: 55,
    category: 'prescription',
    image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=300&h=200&fit=crop',
    requiresPrescription: true,
    inStock: true,
    manufacturer: 'Dr. Reddy\'s'
  },
  {
    id: '29',
    name: 'Losartan 50mg',
    description: 'Hypertension medication',
    price: 75,
    category: 'prescription',
    image: 'https://images.unsplash.com/photo-1512069772995-ec65bbf3d571?w=300&h=200&fit=crop',
    requiresPrescription: true,
    inStock: true,
    manufacturer: 'Merck'
  },
  {
    id: '30',
    name: 'Ciprofloxacin 500mg',
    description: 'Fluoroquinolone antibiotic',
    price: 115,
    category: 'prescription',
    image: 'https://images.unsplash.com/photo-1563213126-a4273aed2016?w=300&h=200&fit=crop',
    requiresPrescription: true,
    inStock: true,
    manufacturer: 'Bayer'
  }
];
