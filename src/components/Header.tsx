// src/components/Header.tsx
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface HeaderProps {
  onProfileClick?: () => void;
}

export function Header({ onProfileClick }: HeaderProps) {
  const { userProfile } = useAuth();

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <img src="/logo.jpg" alt="Brumerie" className="h-8 w-8 rounded" />
          <h1 className="text-xl font-bold text-primary">Brumerie</h1>
        </div>

        {/* Profil */}
        {userProfile && (
          <button
            onClick={onProfileClick}
            className="flex items-center gap-2 hover:bg-gray-50 rounded-lg px-3 py-2 transition"
          >
            <img
              src={userProfile.photoURL || 'https://via.placeholder.com/40'}
              alt={userProfile.name}
              className="w-8 h-8 rounded-full object-cover"
            />
            <span className="text-sm font-medium hidden sm:block">{userProfile.name}</span>
          </button>
        )}
      </div>
    </header>
  );
}
