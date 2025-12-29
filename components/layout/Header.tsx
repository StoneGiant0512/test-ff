'use client';

import { User } from '@/types/auth';
import { authStorage } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/shared';

interface HeaderProps {
  user: User;
}

export default function Header({ user }: HeaderProps) {
  const router = useRouter();

  const handleLogout = () => {
    authStorage.removeToken();
    router.push('/login');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Title */}
          <div className="flex items-center">
            <h1 className="text-lg sm:text-xl font-bold text-gray-900">Project Dashboard</h1>
          </div>

          {/* User Info and Logout */}
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="hidden sm:flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user.name}</p>
                <p className="text-xs text-gray-500 hidden lg:block">{user.email}</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center">
                <span className="text-white font-medium text-sm">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
            {/* Mobile: Show only avatar */}
            <div className="sm:hidden h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
              <span className="text-white font-medium text-xs">
                {user.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleLogout}
              className="text-xs sm:text-sm"
            >
              <span className="hidden sm:inline">Logout</span>
              <span className="sm:hidden">Out</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}

