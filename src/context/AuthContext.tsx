import React, { createContext, useContext, useCallback, useMemo, useState, useEffect } from 'react';
import { User } from '../types';
import {
  loginUser,
  registerUser,
  getCurrentUser,
  updateProfile as updateProfileApi,
  getStoredToken,
  setStoredToken,
  clearStoredToken,
  ApiUser,
} from '../api/client';

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signUp: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => void;
  updateProfile: (updates: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  isAuthenticated: false,
  isLoading: true,
  signUp: async () => ({ success: false, error: 'Not initialized' }),
  signIn: async () => ({ success: false, error: 'Not initialized' }),
  signOut: () => {},
  updateProfile: async () => {},
});

function convertApiUserToUser(apiUser: ApiUser): User {
  return {
    id: apiUser.id,
    name: apiUser.name,
    email: apiUser.email,
    babyName: apiUser.babyName,
    dueDate: apiUser.dueDate,
    createdAt: apiUser.createdAt,
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // On mount, check if we have a stored token and verify it
  useEffect(() => {
    const initAuth = async () => {
      const token = getStoredToken();
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await getCurrentUser();
        setCurrentUser(convertApiUserToUser(response.user));
      } catch {
        // Token is invalid or expired, clear it
        clearStoredToken();
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const signUp = useCallback(
    async (name: string, email: string, password: string): Promise<{ success: boolean; error?: string }> => {
      try {
        // Local validation
        if (!email.trim() || !password.trim() || !name.trim()) {
          return { success: false, error: 'All fields are required' };
        }
        if (password.length < 6) {
          return { success: false, error: 'Password must be at least 6 characters' };
        }

        const response = await registerUser(name.trim(), email.trim(), password);
        setStoredToken(response.token);
        setCurrentUser(convertApiUserToUser(response.user));
        return { success: true };
      } catch (err: any) {
        return { success: false, error: err.message || 'Registration failed. Please try again.' };
      }
    },
    []
  );

  const signIn = useCallback(
    async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
      try {
        if (!email.trim() || !password.trim()) {
          return { success: false, error: 'Email and password are required' };
        }

        const response = await loginUser(email.trim(), password);
        setStoredToken(response.token);
        setCurrentUser(convertApiUserToUser(response.user));
        return { success: true };
      } catch (err: any) {
        return { success: false, error: err.message || 'Sign in failed. Please try again.' };
      }
    },
    []
  );

  const signOut = useCallback(() => {
    clearStoredToken();
    setCurrentUser(null);
  }, []);

  const updateProfile = useCallback(
    async (updates: Partial<User>) => {
      if (!currentUser) return;

      try {
        // Convert from our User type to the API format
        const apiUpdates: { name?: string; baby_name?: string; due_date?: string } = {};
        if (updates.name) apiUpdates.name = updates.name;
        if (updates.babyName !== undefined) apiUpdates.baby_name = updates.babyName;
        if (updates.dueDate !== undefined) apiUpdates.due_date = updates.dueDate;

        const response = await updateProfileApi(apiUpdates);
        setCurrentUser(convertApiUserToUser(response.user));
      } catch (err: any) {
        console.error('Profile update failed:', err.message);
        throw err;
      }
    },
    [currentUser]
  );

  const value = useMemo(
    () => ({
      currentUser,
      isAuthenticated: currentUser !== null,
      isLoading,
      signUp,
      signIn,
      signOut,
      updateProfile,
    }),
    [currentUser, isLoading, signUp, signIn, signOut, updateProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
