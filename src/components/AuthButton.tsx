'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { LogIn, LogOut, User } from 'lucide-react';
import { getGravatarUrl } from '@/utils/gravatar';

interface User {
  id: string;
  email: string;
  name?: string;
}

interface AuthButtonProps {
  user?: User;
  onLogin: () => void;
  onLogout: () => void;
}

export function AuthButton({ user, onLogin, onLogout }: AuthButtonProps) {
  const [gravatarUrl, setGravatarUrl] = useState<string>('');

  useEffect(() => {
    if (user?.email) {
      const url = getGravatarUrl(user.email, 32);
      setGravatarUrl(url);
    }
  }, [user?.email]);

  if (!user) {
    return (
      <Button onClick={onLogin} variant="outline" size="sm" className="text-xs sm:text-sm">
        <LogIn className="w-4 h-4 mr-1 sm:mr-2" />
        Sign In
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="p-1">
          {gravatarUrl ? (
            <img
              src={gravatarUrl}
              alt={user.name || user.email}
              className="w-8 h-8 rounded-full"
              onError={(e) => {
                // Fallback to user icon if gravatar fails
                e.currentTarget.style.display = 'none';
                const parent = e.currentTarget.parentElement;
                if (parent) {
                  const fallback = document.createElement('div');
                  fallback.className = 'w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center';
                  fallback.innerHTML = '<svg class="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path></svg>';
                  parent.appendChild(fallback);
                }
              }}
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
              <User className="w-5 h-5 text-gray-600" />
            </div>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="px-2 py-1.5 text-sm">
          <div className="font-medium">{user.name || 'User'}</div>
          <div className="text-gray-500 text-xs">{user.email}</div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onLogout}>
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}