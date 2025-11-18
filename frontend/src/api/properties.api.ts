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
    // Si hay archivos, enviar multipart/form-data
    const files = (data as any).imagenes;
    const hasFiles =
      Array.isArray(files) && files.some((f: any) => f instanceof File);
    if (hasFiles) {
      const formData = new FormData();

      // Función para añadir campos anidados (objetos) usando notación con puntos
      const appendField = (key: string, value: any) => {
        if (value === undefined || value === null) return;
        if (Array.isArray(value)) {
          // enviar arrays como JSON (ajusta si tu backend espera múltiples entradas)
          formData.append(key, JSON.stringify(value));
        } else if (
          typeof value === "object" &&
          !(value instanceof File) &&
          !(value instanceof Date)
        ) {
          Object.entries(value).forEach(([k, v]) =>
            appendField(`${key}.${k}`, v)
          );
        } else {
          formData.append(key, String(value));
        }
      };

      // Añadir todos los campos excepto imagenes
      Object.entries(data).forEach(([k, v]) => {
        if (k === "imagenes") return;
        appendField(k, v);
      });

      // Añadir archivos (mismo nombre 'imagenes' para múltiples)
      files.forEach((file: File) => {
        formData.append("imagenes", file);
      });

      const response = await axiosInstance.post("/api/propiedades", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    }

    // Si no hay archivos, mandar JSON normal
    const response = await axiosInstance.post("/api/propiedades", data);
    return response.data;
  },

  update: async (
    id: string,
    data: Partial<PropertyFormData>
  ): Promise<PropertyResponse> => {
    const files = (data as any).imagenes;
    const hasFiles =
      Array.isArray(files) && files.some((f: any) => f instanceof File);
    if (hasFiles) {
      const formData = new FormData();

      const appendField = (key: string, value: any) => {
        if (value === undefined || value === null) return;
        if (Array.isArray(value)) {
          formData.append(key, JSON.stringify(value));
        } else if (
          typeof value === "object" &&
          !(value instanceof File) &&
          !(value instanceof Date)
        ) {
          Object.entries(value).forEach(([k, v]) =>
            appendField(`${key}.${k}`, v)
          );
        } else {
          formData.append(key, String(value));
        }
      };

      Object.entries(data).forEach(([k, v]) => {
        if (k === "imagenes") return;
        appendField(k, v);
      });

      files.forEach((file: File) => {
        formData.append("imagenes", file);
      });

      const response = await axiosInstance.put(
        `/api/propiedades/${id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      return response.data;
    }

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
