import React, { createContext, useContext, useCallback, useMemo } from 'react';
import { User } from '../types';
import { usePersistedState } from '../storage/usePersistedState';

interface AuthContextType {
  currentUser: User | null;
  users: User[];
  isAuthenticated: boolean;
  signUp: (name: string, email: string, password: string) => { success: boolean; error?: string };
  signIn: (email: string, password: string) => { success: boolean; error?: string };
  signOut: () => void;
  updateProfile: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  users: [],
  isAuthenticated: false,
  signUp: () => ({ success: false, error: 'Not initialized' }),
  signIn: () => ({ success: false, error: 'Not initialized' }),
  signOut: () => {},
  updateProfile: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = usePersistedState<User | null>('auth_currentUser', null);
  const [users, setUsers] = usePersistedState<User[]>('auth_users', []);

  const signUp = useCallback(
    (name: string, email: string, password: string): { success: boolean; error?: string } => {
      // Validate
      if (!email.trim() || !password.trim() || !name.trim()) {
        return { success: false, error: 'All fields are required' };
      }
      if (password.length < 6) {
        return { success: false, error: 'Password must be at least 6 characters' };
      }
      // Check if email already exists
      if (users.find((u) => u.email.toLowerCase() === email.toLowerCase())) {
        return { success: false, error: 'An account with this email already exists' };
      }

      const newUser: User = {
        id: Date.now().toString(36) + Math.random().toString(36).slice(2, 8),
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password, // In production, hash this
        createdAt: new Date().toISOString(),
      };

      const updatedUsers = [...users, newUser];
      setUsers(updatedUsers);
      setCurrentUser(newUser);

      return { success: true };
    },
    [users, setUsers, setCurrentUser]
  );

  const signIn = useCallback(
    (email: string, password: string): { success: boolean; error?: string } => {
      if (!email.trim() || !password.trim()) {
        return { success: false, error: 'Email and password are required' };
      }

      const found = users.find(
        (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
      );

      if (!found) {
        return { success: false, error: 'Invalid email or password' };
      }

      setCurrentUser(found);
      return { success: true };
    },
    [users, setCurrentUser]
  );

  const signOut = useCallback(() => {
    setCurrentUser(null);
  }, [setCurrentUser]);

  const updateProfile = useCallback(
    (updates: Partial<User>) => {
      if (!currentUser) return;
      const updated: User = { ...currentUser, ...updates };
      setCurrentUser(updated);
      setUsers(users.map((u) => (u.id === updated.id ? updated : u)));
    },
    [currentUser, users, setCurrentUser, setUsers]
  );

  const value = useMemo(
    () => ({
      currentUser,
      users,
      isAuthenticated: currentUser !== null,
      signUp,
      signIn,
      signOut,
      updateProfile,
    }),
    [currentUser, users, signUp, signIn, signOut, updateProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}

