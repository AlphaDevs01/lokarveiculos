export interface Vehicle {
  id: number;
  nome: string;
  marca: string;
  ano: number;
  valor_diaria: number;
  status: 'disponível' | 'indisponível';
  imagem_url: string;
  descricao?: string;
  caracteristicas?: string[];
  created_at: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  loading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}