import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, VendorProfile, CustomerProfile } from '@/types';
import { mockVendor, mockCustomer, mockVendorProfile, mockCustomerProfile } from '@/lib/mockData';

interface AuthContextType {
  user: User | null;
  profile: VendorProfile | CustomerProfile | null;
  vendorProfile: VendorProfile | null;
  customerProfile: CustomerProfile | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [vendorProfile, setVendorProfile] = useState<VendorProfile | null>(null);
  const [customerProfile, setCustomerProfile] = useState<CustomerProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('medihub_user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      
      if (parsedUser.role === 'vendor') {
        setVendorProfile(mockVendorProfile);
      } else {
        setCustomerProfile(mockCustomerProfile);
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    // Mock authentication
    if (email === 'vendor@medihub.com' && password === 'Vendor@123') {
      setUser(mockVendor);
      setVendorProfile(mockVendorProfile);
      localStorage.setItem('medihub_user', JSON.stringify(mockVendor));
    } else if (email === 'customer@medihub.com' && password === 'Customer@123') {
      setUser(mockCustomer);
      setCustomerProfile(mockCustomerProfile);
      localStorage.setItem('medihub_user', JSON.stringify(mockCustomer));
    } else {
      throw new Error('Invalid credentials');
    }
  };

  const logout = () => {
    setUser(null);
    setVendorProfile(null);
    setCustomerProfile(null);
    localStorage.removeItem('medihub_user');
  };

  const profile = vendorProfile || customerProfile;

  return (
    <AuthContext.Provider value={{ user, profile, vendorProfile, customerProfile, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
