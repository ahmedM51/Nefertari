import React, { createContext, useContext, useState, useEffect } from 'react';
import { Profile, UserRole } from '../types';

interface AuthContextType {
  token: string | null;
  user: Profile | null;
  role: UserRole;
  isAuthenticated: boolean;
  isDbConfigured: boolean;
  isLoading: boolean;
  loginAsRole: (role: UserRole) => Promise<void>;
  loginWithCredentials: (email: string, password: string) => Promise<boolean>;
  registerAccount: (email: string, password: string, fullName: string, phone?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (profileData: { full_name: string; phone: string; address: string }) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('nefertari_token') || 'mock-user-token');
  const [user, setUser] = useState<Profile | null>(() => {
    try {
      const saved = localStorage.getItem('nefertari_user');
      return saved ? JSON.parse(saved) : {
        id: 'demo-user-id',
        full_name: 'Ahmed Mohamed',
        phone: '+201122334455',
        address: '15 Zamalek Mansions, Cairo, Egypt',
        role: 'user' as const,
        created_at: new Date().toISOString()
      };
    } catch {
      return null;
    }
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isDbConfigured, setIsDbConfigured] = useState(false);

  useEffect(() => {
    fetch('/api/database-status')
      .then(async (res) => {
        if (!res.ok) return;
        const data = await res.json();
        setIsDbConfigured(data.isSupabaseConfigured);
      })
      .catch(() => setIsDbConfigured(false));
  }, []);

  const loginAsRole = async (targetRole: UserRole) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/demo-toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: targetRole }),
      });
      if (!res.ok) return;
      const data = await res.json();
      if (data.token) {
        setToken(data.token);
        setUser(data.profile);
        localStorage.setItem('nefertari_token', data.token);
        localStorage.setItem('nefertari_user', JSON.stringify(data.profile));
      }
    } catch (e) {
      console.error("Auth simulation failed:", e);
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithCredentials = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.token) {
          setToken(data.token);
          setUser(data.profile);
          localStorage.setItem('nefertari_token', data.token);
          localStorage.setItem('nefertari_user', JSON.stringify(data.profile));
          return true;
        }
      }
      return false;
    } catch (e) {
      console.error("Auth login failed:", e);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const registerAccount = async (
    email: string,
    password: string,
    fullName: string,
    phone?: string
  ): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, full_name: fullName, phone }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        return { success: true };
      }
      return { success: false, error: data.error || 'Registration failed.' };
    } catch {
      return { success: false, error: 'Server unavailable. Please try again.' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('nefertari_token');
    localStorage.removeItem('nefertari_user');
  };

  const updateProfile = async (profileData: { full_name: string; phone: string; address: string }) => {
    if (!token) return false;
    try {
      const res = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(profileData)
      });
      if (res.ok) {
        const updated = await res.json();
        // Update local memory state
        const updatedUser = { ...user, ...profileData } as Profile;
        setUser(updatedUser);
        localStorage.setItem('nefertari_user', JSON.stringify(updatedUser));
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const role = user ? user.role : 'user';
  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value={{
      token,
      user,
      role,
      isAuthenticated,
      isDbConfigured,
      isLoading,
      loginAsRole,
      loginWithCredentials,
      registerAccount,
      logout,
      updateProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used inside an AuthProvider');
  }
  return context;
};
