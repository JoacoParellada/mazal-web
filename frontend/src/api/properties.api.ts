import axiosInstance from "./axios.config";
import {
  Property,
  PropertyFilters,
  PropertyFormData,
} from "@/types/propierties.types";

interface PropertiesResponse {
  success: boolean;
  count: number;
  total: number;
  pagination?: {
    next?: { page: number; limit: number };
    prev?: { page: number; limit: number };
  };
  data: Property[];
}

interface PropertyResponse {
  success: boolean;
  data: Property;
}

export const propertiesAPI = {
  getAll: async (filters?: PropertyFilters): Promise<PropertiesResponse> => {
    const params = new URLSearchParams();

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          params.append(key, String(value));
        }
      });
    }

    const response = await axiosInstance.get(
      `/api/propiedades?${params.toString()}`
    );
    return response.data;
  },

  getFeatured: async () => {
    const { data } = await axiosInstance.get("/api/propiedades/destacadas");
    return data;
  },

  getById: async (id: string): Promise<PropertyResponse> => {
    const response = await axiosInstance.get(`/api/propiedades/${id}`);
    return response.data;
  },

  create: async (data: PropertyFormData): Promise<PropertyResponse> => {
    const response = await axiosInstance.post("/api/propiedades", data);
    return response.data;
  },

  update: async (
    id: string,
    data: Partial<PropertyFormData>
  ): Promise<PropertyResponse> => {
    const response = await axiosInstance.put(`/api/propiedades/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<{ success: boolean }> => {
    const response = await axiosInstance.delete(`/api/propiedades/${id}`);
    return response.data;
  },

  toggleVisibility: async (id: string): Promise<PropertyResponse> => {
    const response = await axiosInstance.put(
      `/api/propiedades/${id}/visibilidad`
    );
    return response.data;
  },

  toggleDestacada: async (id: string): Promise<PropertyResponse> => {
    const response = await axiosInstance.put(`/api/propiedades/${id}/destacar`);
    return response.data;
  },

  getStats: async () => {
    const response = await axiosInstance.get("/api/propiedades/stats/resumen");
    return response.data;
  },
};
