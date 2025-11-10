import { create } from "zustand";

import { propertiesAPI } from "@api/properties.api";
import {
  PropertiesState,
  PropertyFilters,
  PropertyFormData,
} from "@/types/propierties.types";

export const usePropertiesStore = create<PropertiesState>((set, get) => ({
  properties: [],
  currentProperty: null,
  filters: {},
  isLoading: false,
  error: null,
  total: 0,
  page: 1,
  limit: 12,

  fetchProperties: async (filters?: PropertyFilters) => {
    set({ isLoading: true, error: null });
    try {
      const response = await propertiesAPI.getAll(filters || get().filters);
      set({
        properties: response.data,
        total: response.total,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Error al cargar propiedades",
        isLoading: false,
      });
    }
  },

  fetchPropertyById: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await propertiesAPI.getById(id);
      set({
        currentProperty: response.data,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Error al cargar propiedad",
        isLoading: false,
      });
    }
  },

  createProperty: async (data: PropertyFormData) => {
    set({ isLoading: true, error: null });
    try {
      await propertiesAPI.create(data);
      set({ isLoading: false, error: null });
      // Recargar propiedades
      get().fetchProperties();
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Error al crear propiedad",
        isLoading: false,
      });
      throw error;
    }
  },

  updateProperty: async (id: string, data: Partial<PropertyFormData>) => {
    set({ isLoading: true, error: null });
    try {
      await propertiesAPI.update(id, data);
      set({ isLoading: false, error: null });
      // Recargar propiedades
      get().fetchProperties();
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Error al actualizar propiedad",
        isLoading: false,
      });
      throw error;
    }
  },

  deleteProperty: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await propertiesAPI.delete(id);
      set({ isLoading: false, error: null });
      // Recargar propiedades
      get().fetchProperties();
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Error al eliminar propiedad",
        isLoading: false,
      });
      throw error;
    }
  },

  fetchFeaturedProperties: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await propertiesAPI.getFeatured(); // usa /destacadas
      set({
        properties: response.data,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Error al cargar destacadas",
        isLoading: false,
      });
    }
  },

  setFilters: (filters: PropertyFilters) => {
    set({ filters });
  },

  clearFilters: () => {
    set({ filters: {} });
  },

  clearError: () => {
    set({ error: null });
  },
}));
