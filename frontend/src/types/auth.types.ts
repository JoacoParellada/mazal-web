export interface User {
  _id: string;
  nombre: string;
  email: string;
  rol: "admin" | "agente" | "supervisor";
  telefono?: string;
  activo: boolean;
  ultimoAcceso?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  nombre: string;
  email: string;
  password: string;
  rol: "admin" | "agente" | "supervisor";
  telefono?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    _id: string;
    nombre: string;
    email: string;
    rol: string;
    token: string;
  };
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
  clearError: () => void;
}
