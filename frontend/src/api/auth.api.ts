import axiosInstance from "./axios.config";
import {
  LoginCredentials,
  RegisterData,
  AuthResponse,
  User,
} from "@/types/auth.types";

export const authAPI = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await axiosInstance.post("/api/auth/login", credentials);
    return response.data;
  },

  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await axiosInstance.post("/api/auth/registro", data);
    return response.data;
  },

  getCurrentUser: async (): Promise<{ success: boolean; data: User }> => {
    const response = await axiosInstance.get("/api/auth/me");
    return response.data;
  },

  updatePassword: async (passwordActual: string, passwordNueva: string) => {
    const response = await axiosInstance.put("/api/auth/actualizar-password", {
      passwordActual,
      passwordNueva,
    });
    return response.data;
  },
};
