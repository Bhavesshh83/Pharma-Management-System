
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
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&h=200&fit=crop',
    requiresPrescription: false,
    inStock: true,
    manufacturer: 'Micro Labs'
  },
  
  // Headache Medicines
  {
    id: '3',
    name: 'Saridon Advanced',
    description: 'Fast relief from headache',
    price: 35,
    category: 'headache',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&h=200&fit=crop',
    requiresPrescription: false,
    inStock: true,
    manufacturer: 'Piramal Healthcare'
  },
  {
    id: '4',
    name: 'Anacin Extra',
    description: 'Relief from severe headaches',
    price: 28,
    category: 'headache',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&h=200&fit=crop',
    requiresPrescription: false,
    inStock: true,
    manufacturer: 'Pfizer'
  },
  
  // Cough Medicines
  {
    id: '5',
    name: 'Benadryl Cough Syrup',
    description: 'Dry cough relief syrup',
    price: 85,
    category: 'cough',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&h=200&fit=crop',
    requiresPrescription: false,
    inStock: true,
    manufacturer: 'Johnson & Johnson'
  },
  {
    id: '6',
    name: 'Honitus Cough Drops',
    description: 'Herbal cough drops',
    price: 15,
    category: 'cough',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&h=200&fit=crop',
    requiresPrescription: false,
    inStock: true,
    manufacturer: 'Dabur'
  },
  
  // Energy Products
  {
    id: '7',
    name: 'Electral Powder',
    description: 'Oral rehydration salts',
    price: 25,
    category: 'energy',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&h=200&fit=crop',
    requiresPrescription: false,
    inStock: true,
    manufacturer: 'FDC Limited'
  },
  {
    id: '8',
    name: 'ORS Solution',
    description: 'World Health Organization formula',
    price: 20,
    category: 'energy',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&h=200&fit=crop',
    requiresPrescription: false,
    inStock: true,
    manufacturer: 'Cipla'
  },
  {
    id: '9',
    name: 'Glucon-D Orange',
    description: 'Energy drink powder with vitamin D',
    price: 55,
    category: 'energy',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&h=200&fit=crop',
    requiresPrescription: false,
    inStock: true,
    manufacturer: 'Heinz India'
  },
  
  // Prescription Medicines
  {
    id: '10',
    name: 'Azithromycin 500mg',
    description: 'Antibiotic for bacterial infections',
    price: 125,
    category: 'prescription',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&h=200&fit=crop',
    requiresPrescription: true,
    inStock: true,
    manufacturer: 'Sun Pharma'
  },
  {
    id: '11',
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
    id: '12',
    name: 'Amoxicillin 250mg',
    description: 'Broad-spectrum antibiotic',
    price: 85,
    category: 'prescription',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&h=200&fit=crop',
    requiresPrescription: true,
    inStock: true,
    manufacturer: 'Ranbaxy'
  }
];
