export interface Property {
  _id: string;
  titulo: string;
  descripcion: string;
  tipo:
    | "casa"
    | "departamento"
    | "local"
    | "terreno"
    | "oficina"
    | "ph"
    | "quinta";
  operacion: "venta" | "alquiler";
  direccion: {
    calle?: string;
    numero?: string;
    piso?: string;
    departamento?: string;
    barrio?: string;
    ciudad: string;
    provincia: string;
    codigoPostal?: string;
    ubicacion?: string;
  };
  superficie?: {
    total?: number;
    cubierta?: number;
  };
  ambientes?: number;
  dormitorios?: number;
  baños?: number;
  cocheras?: number;
  amenities?: string[];
  precio: number;
  moneda: "ARS" | "USD";
  expensas?: number;
  imagenes?: {
    url: string;
    esPrincipal: boolean;
    orden: number;
  }[];
  video?: string;
  estado: "disponible" | "reservada" | "vendida" | "alquilada";
  destacada: boolean;
  visible: boolean;
  fechaPublicacion?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface PropertyFilters {
  tipo?: string;
  operacion?: string;
  estado?: string;
  ciudad?: string;
  provincia?: string;
  precioMin?: number;
  precioMax?: number;
  ambientes?: number;
  dormitorios?: number;
  page?: number;
  limit?: number;
  sort?: string;
}

export interface PropertyFormData {
  titulo: string;
  descripcion: string;
  tipo: string;
  operacion: string;
  precio: number;
  moneda: string;
  direccion: {
    calle?: string;
    numero?: string;
    piso?: string;
    departamento?: string;
    barrio?: string;
    ciudad: string;
    provincia: string;
    codigoPostal?: string;
  };
  superficie?: {
    total?: number;
    cubierta?: number;
  };
  ambientes?: number;
  dormitorios?: number;
  baños?: number;
  cocheras?: number;
  amenities?: string[];
  expensas?: number;
  imagenes?: {
    url: string;
    esPrincipal: boolean;
    orden: number;
  }[];
  estado?: string;
  visible?: boolean;
}

export interface PropertiesState {
  properties: Property[];
  currentProperty: Property | null;
  filters: PropertyFilters;
  isLoading: boolean;
  error: string | null;
  total: number;
  page: number;
  limit: number;
  fetchProperties: (filters?: PropertyFilters) => Promise<void>;
  fetchPropertyById: (id: string) => Promise<void>;
  createProperty: (data: PropertyFormData) => Promise<void>;
  updateProperty: (
    id: string,
    data: Partial<PropertyFormData>
  ) => Promise<void>;
  deleteProperty: (id: string) => Promise<void>;
  setFilters: (filters: PropertyFilters) => void;
  clearFilters: () => void;
  clearError: () => void;
}
