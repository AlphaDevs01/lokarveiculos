import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:3000'
});

// Add token from localStorage to Authorization header
const token = localStorage.getItem('token');
if (token) {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

// Vehicle API services
export const vehicleService = {
  // Get all vehicles
  getAll: async () => {
    const response = await api.get('/api/veiculos');
    return response.data;
  },
  
  // Get vehicle by ID
  getById: async (id: number) => {
    const response = await api.get(`/api/veiculos/${id}`);
    return response.data;
  },
  
  // Create new vehicle (admin only)
  create: async (vehicleData: Omit<any, 'id' | 'created_at'>) => {
    const response = await api.post('/api/veiculos', vehicleData);
    return response.data;
  },
  
  // Update vehicle (admin only)
  update: async (id: number, vehicleData: Partial<any>) => {
    const response = await api.put(`/api/veiculos/${id}`, vehicleData);
    return response.data;
  },
  
  // Delete vehicle (admin only)
  delete: async (id: number) => {
    const response = await api.delete(`/api/veiculos/${id}`);
    return response.data;
  }
};

// Auth service
export const authService = {
  login: async (credentials: { email: string; password: string }) => {
    const response = await api.post('/api/login', credentials);
    return response.data;
  }
};