import axiosInstance from "./axios.config";
import { User } from "@types/auth.types";

interface UsersResponse {
  success: boolean;
  count: number;
  data: User[];
}

export const usersAPI = {
  getAll: async (): Promise<UsersResponse> => {
    const response = await axiosInstance.get("/api/usuarios");
    return response.data;
  },

  getById: async (id: string) => {
    const response = await axiosInstance.get(`/api/usuarios/${id}`);
    return response.data;
  },

  update: async (id: string, data: Partial<User>) => {
    const response = await axiosInstance.put(`/api/usuarios/${id}`, data);
    return response.data;
  },

  deactivate: async (id: string) => {
    const response = await axiosInstance.put(`/api/usuarios/${id}/desactivar`);
    return response.data;
  },

  activate: async (id: string) => {
    const response = await axiosInstance.put(`/api/usuarios/${id}/activar`);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await axiosInstance.delete(`/api/usuarios/${id}`);
    return response.data;
  },
};
