import api from "./api";
import { AuthResponse } from "@/interfaces/auth";

export const AuthService = {
  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>("/auth/login", {
      email,
      password,
    });
    return response.data;
  },

  async register(
    username: string,
    email: string,
    password: string
  ): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>("/auth/register", {
        username,
        email,
        password,
      });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || new Error("Registration failed");
    }
  },
};
