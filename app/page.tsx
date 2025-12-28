'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Project, ProjectFormData } from '@/types/project';
import { projectApi, authApi } from '@/lib/api';
import { authStorage } from '@/lib/auth';
import { User } from '@/types/auth';
import ProjectTable from '@/components/ProjectTable';
import ProjectModal from '@/components/ProjectModal';
import StatusFilter from '@/components/StatusFilter';
import SearchBar from '@/components/SearchBar';

export default function Dashboard() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = authStorage.getToken();
      if (!token) {
        router.push('/login');
        return;
      }

      try {
        const userData = await authApi.getCurrentUser();
        setUser(userData);
      } catch (error) {
        // Token is invalid, remove it and redirect to login
        authStorage.removeToken();
        router.push('/login');
      } finally {
        setIsAuthLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  // Fetch projects from API
  const fetchProjects = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await projectApi.getAll(selectedStatus !== 'all' ? selectedStatus : undefined, searchTerm || undefined);
      setProjects(data);
      setFilteredProjects(data);
    } catch (err) {
      console.error('Error fetching projects:', err);
      setError('Failed to load projects. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [selectedStatus, searchTerm]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleAddProject = () => {
    setEditingProject(null);
    setIsModalOpen(true);
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setIsModalOpen(true);
  };

  const handleDeleteProject = async (id: number) => {
    if (!confirm('Are you sure you want to delete this project?')) {
      return;
    }

    try {
      await projectApi.delete(id);
      fetchProjects();
    } catch (err) {
      console.error('Error deleting project:', err);
      alert('Failed to delete project. Please try again.');
    }
  };

  const handleSaveProject = async (formData: ProjectFormData) => {
    try {
      if (editingProject) {
        await projectApi.update(editingProject.id, formData);
      } else {
        await projectApi.create(formData);
      }
      setIsModalOpen(false);
      setEditingProject(null);
      fetchProjects();
    } catch (err) {
      console.error('Error saving project:', err);
      throw err;
    }
  };

  const handleLogout = () => {
    authStorage.removeToken();
    router.push('/login');
  };

  // Show loading state while checking authentication
  if (isAuthLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Don't render dashboard if not authenticated (will redirect)
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Project Dashboard</h1>
              <p className="mt-2 text-gray-600">Manage and track your projects</p>
              {user && (
                <p className="mt-1 text-sm text-gray-500">
                  Welcome, <span className="font-medium">{user.name}</span>
                </p>
              )}
            </div>
            <div className="flex gap-3 items-center">
              <button
                onClick={handleAddProject}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors shadow-sm hover:shadow-md"
              >
                + Add New Project
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium transition-colors"
              >
                Logout
              </button>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <StatusFilter selectedStatus={selectedStatus} onStatusChange={setSelectedStatus} />
            <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {/* Projects Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <ProjectTable
            projects={filteredProjects}
            onEdit={handleEditProject}
            onDelete={handleDeleteProject}
            isLoading={isLoading}
          />
        </div>

        {/* Project Count */}
        {!isLoading && (
          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredProjects.length} project{filteredProjects.length !== 1 ? 's' : ''}
          </div>
        )}

        {/* Modal */}
        <ProjectModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingProject(null);
          }}
          onSave={handleSaveProject}
          project={editingProject}
        />
      </div>
    </div>
  );
}
