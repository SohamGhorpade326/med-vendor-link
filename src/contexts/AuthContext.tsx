import React, { createContext, useContext, useState, useEffect } from "react";
import { authAPI } from "@/lib/api";

interface AuthContextType {
  user: any;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // ✅ Restore login session
  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("medihub_user");

    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  // ✅ Login using backend API
  const login = async (email: string, password: string) => {
    const data = await authAPI.login(email, password);
    localStorage.setItem("token", data.token);
    localStorage.setItem("medihub_user", JSON.stringify(data.user));
    setUser(data.user);
  };

  // ✅ Logout
  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("medihub_user");
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
