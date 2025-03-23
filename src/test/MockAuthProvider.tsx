import React from 'react';
import { AuthProvider } from '@/contexts/AuthContext';

interface MockAuthProviderProps {
  children: React.ReactNode;
}

export const MockAuthProvider = ({ children }: MockAuthProviderProps) => {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
}; 