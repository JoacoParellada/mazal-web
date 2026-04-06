export type PropertyField =
  | "ambientes"
  | "dormitorios"
  | "banos"
  | "cocheras"
  | "superficieTotal"
  | "superficieCubierta"
  | "expensas"
  | "amenities";

interface FieldConfig {
  label: string;
  show: boolean;
}

type PropertyFieldsConfig = Record<PropertyField, FieldConfig>;

const BASE_CONFIG: PropertyFieldsConfig = {
  ambientes: { label: "Ambientes", show: false },
  dormitorios: { label: "Dormitorios", show: false },
  banos: { label: "Baños", show: false },
  cocheras: { label: "Cocheras", show: false },
  superficieTotal: { label: "Superficie Total (m²)", show: false },
  superficieCubierta: { label: "Superficie Cubierta (m²)", show: false },
  expensas: { label: "Expensas", show: false },
  amenities: { label: "Amenities", show: false },
};

export const PROPERTY_FIELDS_CONFIG: Record<string, PropertyFieldsConfig> = {
  casa: {
    ...BASE_CONFIG,
    ambientes: { label: "Ambientes", show: true },
    dormitorios: { label: "Dormitorios", show: true },
    banos: { label: "Baños", show: true },
    cocheras: { label: "Cocheras", show: true },
    superficieTotal: { label: "Superficie Total (m²)", show: true },
    superficieCubierta: { label: "Superficie Cubierta (m²)", show: true },
    expensas: { label: "Expensas", show: false },
    amenities: { label: "Amenities", show: true },
  },
  departamento: {
    ...BASE_CONFIG,
    ambientes: { label: "Ambientes", show: true },
    dormitorios: { label: "Dormitorios", show: true },
    banos: { label: "Baños", show: true },
    cocheras: { label: "Cocheras", show: true },
    superficieTotal: { label: "Superficie Total (m²)", show: true },
    superficieCubierta: { label: "Superficie Cubierta (m²)", show: true },
    expensas: { label: "Expensas mensuales", show: true },
    amenities: { label: "Amenities", show: true },
  },
  ph: {
    ...BASE_CONFIG,
    ambientes: { label: "Ambientes", show: true },
    dormitorios: { label: "Dormitorios", show: true },
    banos: { label: "Baños", show: true },
    cocheras: { label: "Cocheras", show: true },
    superficieTotal: { label: "Superficie Total (m²)", show: true },
    superficieCubierta: { label: "Superficie Cubierta (m²)", show: true },
    expensas: { label: "Expensas mensuales", show: true },
    amenities: { label: "Amenities", show: true },
  },
  quinta: {
    ...BASE_CONFIG,
    ambientes: { label: "Ambientes", show: true },
    dormitorios: { label: "Dormitorios", show: true },
    banos: { label: "Baños", show: true },
    cocheras: { label: "Cocheras", show: true },
    superficieTotal: { label: "Superficie Total (m²)", show: true },
    superficieCubierta: { label: "Superficie Cubierta (m²)", show: true },
    expensas: { label: "Expensas", show: false },
    amenities: { label: "Amenities", show: true },
  },
  local: {
    ...BASE_CONFIG,
    banos: { label: "Baños / Sanitarios", show: true },
    cocheras: { label: "Estacionamientos", show: true },
    superficieTotal: { label: "Superficie Total (m²)", show: true },
    superficieCubierta: { label: "Superficie Cubierta (m²)", show: true },
    expensas: { label: "Expensas mensuales", show: true },
    amenities: { label: "Características", show: true },
  },
  oficina: {
    ...BASE_CONFIG,
    ambientes: { label: "Ambientes / Sectores", show: true },
    banos: { label: "Baños", show: true },
    cocheras: { label: "Cocheras", show: true },
    superficieTotal: { label: "Superficie Total (m²)", show: true },
    superficieCubierta: { label: "Superficie Cubierta (m²)", show: true },
    expensas: { label: "Expensas mensuales", show: true },
    amenities: { label: "Características", show: true },
  },
  terreno: {
    ...BASE_CONFIG,
    superficieTotal: { label: "Superficie Total (m²)", show: true },
    amenities: { label: "Características", show: true },
  },
};

export const getFieldsConfig = (tipo: string): PropertyFieldsConfig => {
  return PROPERTY_FIELDS_CONFIG[tipo] ?? BASE_CONFIG;
};
