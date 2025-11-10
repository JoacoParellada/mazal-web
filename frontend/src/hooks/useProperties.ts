import { useEffect } from "react";
import { usePropertiesStore } from "@store/propertiesStore";
import { PropertyFilters } from "@/types/propierties.types";

export const useProperties = (initialFilters?: PropertyFilters) => {
  const {
    properties,
    currentProperty,
    filters,
    isLoading,
    error,
    total,
    page,
    limit,
    fetchProperties,
    fetchPropertyById,
    createProperty,
    updateProperty,
    deleteProperty,
    setFilters,
    clearFilters,
    clearError,
  } = usePropertiesStore();

  useEffect(() => {
    if (initialFilters) {
      setFilters(initialFilters);
    }
    fetchProperties(initialFilters);
  }, []);

  return {
    properties,
    currentProperty,
    filters,
    isLoading,
    error,
    total,
    page,
    limit,
    fetchProperties,
    fetchPropertyById,
    createProperty,
    updateProperty,
    deleteProperty,
    setFilters,
    clearFilters,
    clearError,
  };
};
