import axios from 'axios';
import { Project, ProjectFormData, ApiResponse } from '@/types/project';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

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

