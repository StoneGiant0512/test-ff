import axios from 'axios';
import { Project, ProjectFormData, ApiResponse } from '@/types/project';
import { AuthResponse, LoginFormData, RegisterFormData, User } from '@/types/auth';
import { authStorage } from './auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
console.log(API_BASE_URL, 'API_BASE_URL');
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include token in all requests
api.interceptors.request.use(
  (config) => {
    const token = authStorage.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle 401 errors (unauthorized)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      // Token is invalid or expired, remove it
      authStorage.removeToken();
      // Redirect to login if we're in the browser
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Authentication API
export const authApi = {
  register: async (data: RegisterFormData): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/register', data);
    return response.data;
  },

  test: async (): Promise<{}> => {
    const response = await api.get<{}>(`http://test-backend-6r69.onrender.com `);
    console.log("response", response.data)
    return response.data;
  },

  login: async (data: LoginFormData): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>(`${API_BASE_URL}/auth/login`, data);
    return response.data;
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await api.get<{ success: boolean; data: User }>('/auth/me');
    return response.data.data;
  },
};

// Project API
export const projectApi = {
  // Get all projects with optional filters
  getAll: async (status?: string, search?: string): Promise<Project[]> => {
    const params: { status?: string; search?: string } = {};
    if (status && status !== 'all') params.status = status;
    if (search) params.search = search;

    const response = await api.get<ApiResponse<Project[]>>('/projects', { params });
    return response.data.data || [];
  },

  // Get single project by ID
  getById: async (id: number): Promise<Project> => {
    const response = await api.get<ApiResponse<Project>>(`/projects/${id}`);
    if (!response.data.data) {
      throw new Error('Project not found');
    }
    return response.data.data;
  },

  // Create new project
  create: async (projectData: ProjectFormData): Promise<Project> => {
    const response = await api.post<ApiResponse<Project>>('/projects', projectData);
    if (!response.data.data) {
      throw new Error('Failed to create project');
    }
    return response.data.data;
  },

  // Update project
  update: async (id: number, projectData: ProjectFormData): Promise<Project> => {
    const response = await api.put<ApiResponse<Project>>(`/projects/${id}`, projectData);
    if (!response.data.data) {
      throw new Error('Failed to update project');
    }
    return response.data.data;
  },

  // Delete project
  delete: async (id: number): Promise<void> => {
    await api.delete(`/projects/${id}`);
  },
};

