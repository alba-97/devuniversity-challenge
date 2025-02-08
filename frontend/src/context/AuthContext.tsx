"use client";

import React, { createContext, useState, useContext, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { User, AuthContextType } from "@/interfaces/auth";
import { AuthService } from "@/services/AuthService";

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  const login = async (email: string, password: string) => {
    try {
      const userData = await AuthService.login(email, password);

      setUser({
        id: userData.userId,
        username: userData.username,
        email: userData.email,
      });
      setIsAuthenticated(true);
      router.push("/dashboard");
    } catch (error) {
      setUser(null);
      setIsAuthenticated(false);
      throw error;
    }
  };

  const register = async (
    username: string,
    email: string,
    password: string
  ) => {
    try {
      const userData = await AuthService.register(username, email, password);

      setUser({
        id: userData.userId,
        username: userData.username,
        email: userData.email,
      });
      setIsAuthenticated(true);
      router.push("/dashboard");
    } catch (error) {
      setUser(null);
      setIsAuthenticated(false);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await AuthService.logout();
      setUser(null);
      setIsAuthenticated(false);
      router.push("/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
