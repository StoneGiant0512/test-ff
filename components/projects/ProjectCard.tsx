'use client';

import { Project } from '@/types/project';
import { Badge, Button } from '@/components/shared';

interface ProjectCardProps {
  project: Project;
  onEdit: (project: Project) => void;
  onDelete: (id: number) => void;
}

export default function ProjectCard({ project, onEdit, onDelete }: ProjectCardProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusVariant = (status: string): 'success' | 'warning' | 'default' => {
    if (status === 'active') return 'success';
    if (status === 'on hold') return 'warning';
    return 'default';
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-base font-semibold text-gray-900 flex-1">{project.name}</h3>
        <Badge variant={getStatusVariant(project.status)}>{project.status}</Badge>
      </div>
      <div className="space-y-2 mb-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Deadline:</span>
          <span className="text-gray-900 font-medium">{formatDate(project.deadline)}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Team Member:</span>
          <span className="text-gray-900 font-medium">{project.assigned_team_member}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Budget:</span>
          <span className="text-gray-900 font-medium">{formatCurrency(project.budget)}</span>
        </div>
      </div>
      <div className="flex gap-2 pt-3 border-t border-gray-200">
        <Button
          variant="primary"
          size="sm"
          className="flex-1"
          onClick={() => onEdit(project)}
        >
          Edit
        </Button>
        <Button
          variant="danger"
          size="sm"
          className="flex-1"
          onClick={() => onDelete(project.id)}
        >
          Delete
        </Button>
      </div>
    </div>
  );
}

