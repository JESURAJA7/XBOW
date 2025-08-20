import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: 'admin';
}

interface AuthContextType {
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored auth token
    const token = localStorage.getItem('xbow_admin_token');
    const userData = localStorage.getItem('xbow_admin_user');
    
    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error('Failed to parse user data:', error);
        localStorage.removeItem('xbow_admin_token');
        localStorage.removeItem('xbow_admin_user');
      }
    }
    
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Mock authentication - replace with actual API call
    try {
      if (email === 'admin@xbow.com' && password === 'admin123') {
        const adminUser: AuthUser = {
          id: '1',
          email: 'admin@xbow.com',
          name: 'XBOW Admin',
          role: 'admin'
        };
        
        setUser(adminUser);
        localStorage.setItem('xbow_admin_token', 'mock-token-123');
        localStorage.setItem('xbow_admin_user', JSON.stringify(adminUser));
        setIsLoading(false);
        return true;
      }
      
      setIsLoading(false);
      return false;
    } catch (error) {
      console.error('Login error:', error);
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('xbow_admin_token');
    localStorage.removeItem('xbow_admin_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};