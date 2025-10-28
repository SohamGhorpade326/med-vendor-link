import { Product, User, Order } from '@/types';

// Mock users
export const mockUsers: User[] = [
  {
    id: '1',
    email: 'vendor@medihub.com',
    name: 'PharmaCorp',
    role: 'vendor',
    createdAt: new Date(),
  },
  {
    id: '2',
    email: 'customer@medihub.com',
    name: 'John Doe',
    role: 'customer',
    createdAt: new Date(),
  },
];

// Initial products
export const initialProducts: Product[] = [
  {
    id: '1',
    name: 'Paracetamol',
    brand: 'Crocin',
    composition: 'Paracetamol 500mg',
    price: 45,
    quantity: 100,
    batchNumber: 'PCM2024-001',
    expiryDate: new Date('2025-12-31'),
    requiresPrescription: false,
    imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400',
    lowStockThreshold: 10,
  },
  {
    id: '2',
    name: 'Amoxicillin',
    brand: 'Moxiclav',
    composition: 'Amoxicillin 500mg + Clavulanic Acid 125mg',
    price: 120,
    quantity: 50,
    batchNumber: 'AMX2024-002',
    expiryDate: new Date('2025-06-30'),
    requiresPrescription: true,
    imageUrl: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400',
    lowStockThreshold: 10,
  },
  {
    id: '3',
    name: 'Aspirin',
    brand: 'Disprin',
    composition: 'Acetylsalicylic Acid 325mg',
    price: 30,
    quantity: 150,
    batchNumber: 'ASP2024-003',
    expiryDate: new Date('2026-03-31'),
    requiresPrescription: false,
    imageUrl: 'https://images.unsplash.com/photo-1550572017-4781c6f30f8d?w=400',
    lowStockThreshold: 10,
  },
  {
    id: '4',
    name: 'Ibuprofen',
    brand: 'Brufen',
    composition: 'Ibuprofen 400mg',
    price: 55,
    quantity: 80,
    batchNumber: 'IBU2024-004',
    expiryDate: new Date('2025-09-30'),
    requiresPrescription: false,
    imageUrl: 'https://images.unsplash.com/photo-1628771065518-0d82f1938462?w=400',
    lowStockThreshold: 10,
  },
  {
    id: '5',
    name: 'Omeprazole',
    brand: 'Omez',
    composition: 'Omeprazole 20mg',
    price: 85,
    quantity: 60,
    batchNumber: 'OME2024-005',
    expiryDate: new Date('2025-08-31'),
    requiresPrescription: true,
    imageUrl: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400',
    lowStockThreshold: 10,
  },
  {
    id: '6',
    name: 'Cetirizine',
    brand: 'Zyrtec',
    composition: 'Cetirizine 10mg',
    price: 40,
    quantity: 120,
    batchNumber: 'CET2024-006',
    expiryDate: new Date('2026-01-31'),
    requiresPrescription: false,
    imageUrl: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=400',
    lowStockThreshold: 10,
  },
  {
    id: '7',
    name: 'Metformin',
    brand: 'Glycomet',
    composition: 'Metformin 500mg',
    price: 95,
    quantity: 70,
    batchNumber: 'MET2024-007',
    expiryDate: new Date('2025-11-30'),
    requiresPrescription: true,
    imageUrl: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400',
    lowStockThreshold: 10,
  },
  {
    id: '8',
    name: 'Vitamin C',
    brand: 'Limcee',
    composition: 'Ascorbic Acid 500mg',
    price: 35,
    quantity: 200,
    batchNumber: 'VIT2024-008',
    expiryDate: new Date('2026-06-30'),
    requiresPrescription: false,
    imageUrl: 'https://images.unsplash.com/photo-1550572017-4781c6f30f8d?w=400',
    lowStockThreshold: 10,
  },
  {
    id: '9',
    name: 'Azithromycin',
    brand: 'Azee',
    composition: 'Azithromycin 500mg',
    price: 150,
    quantity: 5,
    batchNumber: 'AZI2024-009',
    expiryDate: new Date('2025-05-31'),
    requiresPrescription: true,
    imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400',
    lowStockThreshold: 10,
  },
  {
    id: '10',
    name: 'Losartan',
    brand: 'Losar',
    composition: 'Losartan 50mg',
    price: 110,
    quantity: 90,
    batchNumber: 'LOS2024-010',
    expiryDate: new Date('2025-10-31'),
    requiresPrescription: true,
    imageUrl: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=400',
    lowStockThreshold: 10,
  },
  {
    id: '11',
    name: 'Multivitamin',
    brand: 'Revital',
    composition: 'Vitamin Complex',
    price: 250,
    quantity: 100,
    batchNumber: 'MUL2024-011',
    expiryDate: new Date('2026-12-31'),
    requiresPrescription: false,
    imageUrl: 'https://images.unsplash.com/photo-1628771065518-0d82f1938462?w=400',
    lowStockThreshold: 10,
  },
  {
    id: '12',
    name: 'Dolo',
    brand: 'Dolo 650',
    composition: 'Paracetamol 650mg',
    price: 50,
    quantity: 180,
    batchNumber: 'DOL2024-012',
    expiryDate: new Date('2025-07-31'),
    requiresPrescription: false,
    imageUrl: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400',
    lowStockThreshold: 10,
  },
  {
    id: '13',
    name: 'Amlodipine',
    brand: 'Amlong',
    composition: 'Amlodipine 5mg',
    price: 75,
    quantity: 65,
    batchNumber: 'AML2024-013',
    expiryDate: new Date('2025-04-30'),
    requiresPrescription: true,
    imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400',
    lowStockThreshold: 10,
  },
  {
    id: '14',
    name: 'Ranitidine',
    brand: 'Aciloc',
    composition: 'Ranitidine 150mg',
    price: 60,
    quantity: 110,
    batchNumber: 'RAN2024-014',
    expiryDate: new Date('2026-02-28'),
    requiresPrescription: false,
    imageUrl: 'https://images.unsplash.com/photo-1550572017-4781c6f30f8d?w=400',
    lowStockThreshold: 10,
  },
  {
    id: '15',
    name: 'Calcium',
    brand: 'Shelcal',
    composition: 'Calcium Carbonate 500mg + Vitamin D3',
    price: 180,
    quantity: 95,
    batchNumber: 'CAL2024-015',
    expiryDate: new Date('2026-08-31'),
    requiresPrescription: false,
    imageUrl: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=400',
    lowStockThreshold: 10,
  },
];

// Storage keys
const PRODUCTS_KEY = 'medihub_products';
const ORDERS_KEY = 'medihub_orders';

// Initialize products in localStorage if not exists
export const initializeStorage = () => {
  if (!localStorage.getItem(PRODUCTS_KEY)) {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(initialProducts));
  }
  if (!localStorage.getItem(ORDERS_KEY)) {
    localStorage.setItem(ORDERS_KEY, JSON.stringify([]));
  }
};

// Product storage functions
export const getProducts = (): Product[] => {
  try {
    const products = localStorage.getItem(PRODUCTS_KEY);
    return products ? JSON.parse(products) : initialProducts;
  } catch {
    return initialProducts;
  }
};

export const saveProducts = (products: Product[]) => {
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
};

export const addProduct = (product: Product): Product => {
  const products = getProducts();
  const newProduct = {
    ...product,
    id: Date.now().toString(),
  };
  products.push(newProduct);
  saveProducts(products);
  return newProduct;
};

export const updateProduct = (id: string, updates: Partial<Product>): Product => {
  const products = getProducts();
  const index = products.findIndex(p => p.id === id);
  if (index !== -1) {
    products[index] = { ...products[index], ...updates };
    saveProducts(products);
    return products[index];
  }
  throw new Error('Product not found');
};

export const deleteProduct = (id: string) => {
  const products = getProducts();
  const filtered = products.filter(p => p.id !== id);
  saveProducts(filtered);
};

// Order storage functions
export const getOrders = (): Order[] => {
  try {
    const orders = localStorage.getItem(ORDERS_KEY);
    return orders ? JSON.parse(orders) : [];
  } catch {
    return [];
  }
};

export const saveOrder = (order: Omit<Order, 'id'>): Order => {
  const orders = getOrders();
  const newOrder: Order = {
    ...order,
    id: Date.now().toString(),
  };
  orders.push(newOrder);
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  return newOrder;
};
