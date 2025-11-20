export const PROPERTY_TYPES = [
  { value: "casa", label: "Casa" },
  { value: "departamento", label: "Departamento" },
  { value: "local", label: "Local Comercial" },
  { value: "terreno", label: "Terreno" },
  { value: "oficina", label: "Oficina" },
  { value: "ph", label: "PH" },
  { value: "quinta", label: "Quinta" },
];

export const OPERATION_TYPES = [
  { value: "venta", label: "Venta" },
  { value: "alquiler", label: "Alquiler" },
];

export const PROPERTY_STATES = [
  { value: "disponible", label: "Disponible" },
  { value: "reservada", label: "Reservada" },
  { value: "vendida", label: "Vendida" },
  { value: "alquilada", label: "Alquilada" },
];

export const CURRENCIES = [
  { value: "ARS", label: "Pesos (ARS)" },
  { value: "USD", label: "Dólares (USD)" },
];

export const PROVINCES = [
  "Buenos Aires",
  "Catamarca",
  "Chaco",
  "Chubut",
  "Córdoba",
  "Corrientes",
  "Entre Ríos",
  "Formosa",
  "Jujuy",
  "La Pampa",
  "La Rioja",
  "Mendoza",
  "Misiones",
  "Neuquén",
  "Río Negro",
  "Salta",
  "San Juan",
  "San Luis",
  "Santa Cruz",
  "Santa Fe",
  "Santiago del Estero",
  "Tierra del Fuego",
  "Tucumán",
];

export const USER_ROLES = [{ value: "admin", label: "Administrador" }];

export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
