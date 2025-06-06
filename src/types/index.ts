
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'pharmacist' | 'delivery' | 'admin';
  phone?: string;
  address?: string;
}

export interface Medicine {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'basic' | 'prescription' | 'energy' | 'headache' | 'cough';
  image: string;
  requiresPrescription: boolean;
  inStock: boolean;
  manufacturer: string;
}

export interface Prescription {
  id: string;
  userId: string;
  imageUrl: string;
  status: 'pending' | 'verified' | 'rejected';
  uploadedAt: Date;
  verifiedBy?: string;
  medicines?: string[];
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'out_for_delivery' | 'delivered';
  prescriptionId?: string;
  deliveryAddress: string;
  createdAt: Date;
  deliveryPartnerId?: string;
}

export interface OrderItem {
  medicineId: string;
  medicine: Medicine;
  quantity: number;
  price: number;
}

export interface CartItem {
  medicine: Medicine;
  quantity: number;
}
