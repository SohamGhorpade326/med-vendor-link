import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User';
import VendorProfile from '../models/VendorProfile';
import CustomerProfile from '../models/CustomerProfile';
import Product from '../models/Product';

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await VendorProfile.deleteMany({});
    await CustomerProfile.deleteMany({});
    await Product.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create Vendor User
    const vendorPasswordHash = await bcrypt.hash('Vendor@123', 10);
    const vendorUser = await User.create({
      role: 'vendor',
      name: 'MediCare Pharmacy',
      email: 'vendor@medihub.com',
      password: vendorPasswordHash
    });

    const vendorProfile = await VendorProfile.create({
      user: vendorUser._id,
      storeName: 'MediCare Pharmacy',
      licenseNumber: 'LIC-2024-MC-001',
      address: '123 Medical Plaza, Healthcare District, Mumbai, MH 400001',
      phone: '+91-9876543210'
    });

    // Create Customer User
    const customerPasswordHash = await bcrypt.hash('Customer@123', 10);
    const customerUser = await User.create({
      role: 'customer',
      name: 'John Doe',
      email: 'customer@medihub.com',
      password: customerPasswordHash
    });

    await CustomerProfile.create({
      user: customerUser._id,
      addresses: [
        {
          label: 'Home',
          line1: '456 Residential Area',
          line2: 'Apartment 12B',
          city: 'Mumbai',
          state: 'Maharashtra',
          zip: '400050'
        }
      ],
      phone: '+91-9876543211'
    });

    // Create 15 Products
    const products = [
      {
        name: 'Paracetamol 500mg',
        brand: 'Crocin',
        composition: 'Paracetamol 500mg',
        price: 25,
        quantity: 500,
        batchNumber: 'BATCH001',
        requiresPrescription: false,
        imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400',
        lowStockThreshold: 50
      },
      {
        name: 'Amoxicillin 500mg',
        brand: 'Amoxil',
        composition: 'Amoxicillin 500mg',
        price: 120,
        quantity: 200,
        batchNumber: 'BATCH002',
        requiresPrescription: true,
        imageUrl: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400',
        lowStockThreshold: 30
      },
      {
        name: 'Ibuprofen 400mg',
        brand: 'Brufen',
        composition: 'Ibuprofen 400mg',
        price: 45,
        quantity: 350,
        batchNumber: 'BATCH003',
        requiresPrescription: false,
        imageUrl: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=400',
        lowStockThreshold: 40
      },
      {
        name: 'Cetirizine 10mg',
        brand: 'Zyrtec',
        composition: 'Cetirizine Hydrochloride 10mg',
        price: 35,
        quantity: 400,
        batchNumber: 'BATCH004',
        requiresPrescription: false,
        imageUrl: 'https://images.unsplash.com/photo-1550572017-4fade1c67cbb?w=400',
        lowStockThreshold: 50
      },
      {
        name: 'Metformin 500mg',
        brand: 'Glucophage',
        composition: 'Metformin Hydrochloride 500mg',
        price: 80,
        quantity: 300,
        batchNumber: 'BATCH005',
        requiresPrescription: true,
        imageUrl: 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=400',
        lowStockThreshold: 40
      },
      {
        name: 'Omeprazole 20mg',
        brand: 'Prilosec',
        composition: 'Omeprazole 20mg',
        price: 65,
        quantity: 250,
        batchNumber: 'BATCH006',
        requiresPrescription: false,
        imageUrl: 'https://images.unsplash.com/photo-1585435557343-3b092031a831?w=400',
        lowStockThreshold: 35
      },
      {
        name: 'Aspirin 75mg',
        brand: 'Disprin',
        composition: 'Acetylsalicylic Acid 75mg',
        price: 20,
        quantity: 600,
        batchNumber: 'BATCH007',
        requiresPrescription: false,
        imageUrl: 'https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=400',
        lowStockThreshold: 60
      },
      {
        name: 'Azithromycin 500mg',
        brand: 'Zithromax',
        composition: 'Azithromycin 500mg',
        price: 180,
        quantity: 150,
        batchNumber: 'BATCH008',
        requiresPrescription: true,
        imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400',
        lowStockThreshold: 25
      },
      {
        name: 'Vitamin D3 1000IU',
        brand: 'D-Rise',
        composition: 'Cholecalciferol 1000IU',
        price: 150,
        quantity: 200,
        batchNumber: 'BATCH009',
        requiresPrescription: false,
        imageUrl: 'https://images.unsplash.com/photo-1550572017-4fade1c67cbb?w=400',
        lowStockThreshold: 30
      },
      {
        name: 'Losartan 50mg',
        brand: 'Cozaar',
        composition: 'Losartan Potassium 50mg',
        price: 95,
        quantity: 180,
        batchNumber: 'BATCH010',
        requiresPrescription: true,
        imageUrl: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=400',
        lowStockThreshold: 30
      },
      {
        name: 'Pantoprazole 40mg',
        brand: 'Protonix',
        composition: 'Pantoprazole Sodium 40mg',
        price: 75,
        quantity: 220,
        batchNumber: 'BATCH011',
        requiresPrescription: false,
        imageUrl: 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=400',
        lowStockThreshold: 35
      },
      {
        name: 'Ciprofloxacin 500mg',
        brand: 'Cipro',
        composition: 'Ciprofloxacin Hydrochloride 500mg',
        price: 140,
        quantity: 160,
        batchNumber: 'BATCH012',
        requiresPrescription: true,
        imageUrl: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400',
        lowStockThreshold: 25
      },
      {
        name: 'Multivitamin Tablets',
        brand: 'HealthVit',
        composition: 'Multivitamin with Minerals',
        price: 250,
        quantity: 300,
        batchNumber: 'BATCH013',
        requiresPrescription: false,
        imageUrl: 'https://images.unsplash.com/photo-1585435557343-3b092031a831?w=400',
        lowStockThreshold: 40
      },
      {
        name: 'Dolo 650mg',
        brand: 'Dolo',
        composition: 'Paracetamol 650mg',
        price: 30,
        quantity: 8,
        batchNumber: 'BATCH014',
        requiresPrescription: false,
        imageUrl: 'https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=400',
        lowStockThreshold: 10
      },
      {
        name: 'Cough Syrup',
        brand: 'Benadryl',
        composition: 'Diphenhydramine HCl 100ml',
        price: 85,
        quantity: 5,
        batchNumber: 'BATCH015',
        requiresPrescription: false,
        imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400',
        lowStockThreshold: 10
      }
    ];

    for (const productData of products) {
      await Product.create({
        ...productData,
        vendor: vendorProfile._id,
        expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 year from now
      });
    }

    console.log('✅ Seed data created successfully');
    console.log('\n📋 Test Credentials:');
    console.log('Vendor: vendor@medihub.com / Vendor@123');
    console.log('Customer: customer@medihub.com / Customer@123');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
};

seedData();
