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
      `/api/propiedades?${params.toString()}`,
    );
    return response.data;
  },

  getAllAdmin: async (
    filters?: PropertyFilters,
  ): Promise<PropertiesResponse> => {
    const params = new URLSearchParams();

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          params.append(key, String(value));
        }
      });
    }

    const response = await axiosInstance.get(
      `/api/propiedades/admin/todas?${params.toString()}`,
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
    const formData = new FormData();

    formData.append("titulo", data.titulo);
    formData.append("descripcion", data.descripcion);
    formData.append("tipo", data.tipo);
    formData.append("operacion", data.operacion);
    formData.append("precio", data.precio.toString());
    formData.append("moneda", data.moneda || "ARS");

    if (data.direccion) {
      Object.entries(data.direccion).forEach(([key, value]) => {
        if (value) formData.append(`direccion[${key}]`, value);
      });
    }

    if (data.superficie?.total) {
      formData.append("superficie[total]", data.superficie.total.toString());
    }
    if (data.superficie?.cubierta) {
      formData.append(
        "superficie[cubierta]",
        data.superficie.cubierta.toString(),
      );
    }

    if (data.ambientes) formData.append("ambientes", data.ambientes.toString());
    if (data.dormitorios)
      formData.append("dormitorios", data.dormitorios.toString());
    if (data.banos) formData.append("banos", data.banos.toString());
    if (data.cocheras) formData.append("cocheras", data.cocheras.toString());
    if (data.expensas) formData.append("expensas", data.expensas.toString());

    if (data.amenities) {
      formData.append("amenities", JSON.stringify(data.amenities));
    }

    if (data.imagenes && data.imagenes.length > 0) {
      data.imagenes.forEach((imagen) => {
        if (imagen instanceof File) {
          formData.append("imagenes", imagen);
        }
      });
    }

    formData.append("destacada", String(data.destacada || false));
    formData.append("visible", String(data.visible !== false));

    const response = await axiosInstance.post("/api/propiedades", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  update: async (
    id: string,
    data: Partial<PropertyFormData>,
  ): Promise<PropertyResponse> => {
    const formData = new FormData();

    // Campos de texto
    if (data.titulo) formData.append("titulo", data.titulo);
    if (data.descripcion) formData.append("descripcion", data.descripcion);
    if (data.tipo) formData.append("tipo", data.tipo);
    if (data.operacion) formData.append("operacion", data.operacion);
    if (data.precio) formData.append("precio", data.precio.toString());
    if (data.moneda) formData.append("moneda", data.moneda);

    // Dirección
    if (data.direccion) {
      Object.entries(data.direccion).forEach(([key, value]) => {
        if (value) formData.append(`direccion[${key}]`, value);
      });
    }

    // Superficie
    if (data.superficie?.total) {
      formData.append("superficie[total]", data.superficie.total.toString());
    }
    if (data.superficie?.cubierta) {
      formData.append(
        "superficie[cubierta]",
        data.superficie.cubierta.toString(),
      );
    }

    // Características numéricas
    if (data.ambientes !== undefined)
      formData.append("ambientes", data.ambientes.toString());
    if (data.dormitorios !== undefined)
      formData.append("dormitorios", data.dormitorios.toString());
    if (data.banos !== undefined)
      formData.append("banos", data.banos.toString());
    if (data.cocheras !== undefined)
      formData.append("cocheras", data.cocheras.toString());
    if (data.expensas !== undefined)
      formData.append("expensas", data.expensas.toString());

    // Amenities
    if (data.amenities) {
      formData.append("amenities", JSON.stringify(data.amenities));
    }

    if (data.imagenesExistentes) {
      formData.append(
        "imagenesExistentes",
        JSON.stringify(data.imagenesExistentes),
      );
    }

    // Imágenes nuevas
    if (data.imagenes && data.imagenes.length > 0) {
      data.imagenes.forEach((imagen) => {
        if (imagen instanceof File) {
          formData.append("imagenes", imagen);
        }
      });
    }

    // Configuración
    if (data.destacada !== undefined)
      formData.append("destacada", String(data.destacada));
    if (data.visible !== undefined)
      formData.append("visible", String(data.visible));

    const response = await axiosInstance.put(
      `/api/propiedades/${id}`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      },
    );
    return response.data;
  },

  delete: async (id: string): Promise<{ success: boolean }> => {
    const response = await axiosInstance.delete(`/api/propiedades/${id}`);
    return response.data;
  },

  deleteImage: async (
    propertyId: string,
    imageId: string,
  ): Promise<PropertyResponse> => {
    const response = await axiosInstance.delete(
      `/api/propiedades/${propertyId}/imagenes/${imageId}`,
    );
    return response.data;
  },

  toggleVisibility: async (id: string): Promise<PropertyResponse> => {
    const response = await axiosInstance.put(
      `/api/propiedades/${id}/visibilidad`,
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
