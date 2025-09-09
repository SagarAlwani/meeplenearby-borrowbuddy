import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  displayName: string;
  email: string;
  avatar: string;
  bio: string;
  city: string;
  rating: number;
  geoHashApprox: string;
  preferredGenres: string[];
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

interface RegisterData {
  email: string;
  password: string;
  displayName: string;
  city: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Mock users database
  const mockUsers: User[] = [
    {
      id: 'user1',
      displayName: 'Alex Chen',
      email: 'alex@example.com',
      avatar: 'A',
      bio: 'Board game enthusiast who loves strategy games and hosting game nights!',
      city: 'Jaipur, Rajasthan',
      rating: 4.8,
      geoHashApprox: 'tux9qh',
      preferredGenres: ['Strategy', 'Engine Building', 'Co-op', 'Euro']
    },
    {
      id: 'user2',
      displayName: 'Sarah Wilson',
      email: 'sarah@example.com',
      avatar: 'S',
      bio: 'Love party games and family-friendly board games!',
      city: 'Jaipur, Rajasthan',
      rating: 4.9,
      geoHashApprox: 'tux9qk',
      preferredGenres: ['Party', 'Family', 'Social Deduction']
    }
  ];

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem('jaipur_meeples_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    // Mock authentication
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const foundUser = mockUsers.find(u => u.email === email);
    if (!foundUser || password !== 'password123') {
      throw new Error('Invalid credentials');
    }
    
    setUser(foundUser);
    localStorage.setItem('jaipur_meeples_user', JSON.stringify(foundUser));
    setIsLoading(false);
  };

  const register = async (data: RegisterData) => {
    setIsLoading(true);
    
    // Mock registration
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newUser: User = {
      id: `user_${Date.now()}`,
      displayName: data.displayName,
      email: data.email,
      avatar: data.displayName[0].toUpperCase(),
      bio: 'New to the board game community!',
      city: data.city,
      rating: 5.0,
      geoHashApprox: 'tux9qi',
      preferredGenres: []
    };
    
    setUser(newUser);
    localStorage.setItem('jaipur_meeples_user', JSON.stringify(newUser));
    setIsLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('jaipur_meeples_user');
  };

  const value = {
    user,
    login,
    register,
    logout,
    isLoading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};