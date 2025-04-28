
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '@/lib/types';
import { toast } from 'sonner';
import axios from 'axios';

// Define API base URL
const API_URL = 'http://localhost:5000/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean; // Added this property
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUserProfile: (userData: Partial<User>) => void;
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
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const storedToken = localStorage.getItem('authToken');
        const storedUser = localStorage.getItem('authUser');
        
        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Error initializing auth state:', error);
        // Clear potentially corrupted storage
        localStorage.removeItem('authToken');
        localStorage.removeItem('authUser');
      } finally {
        setIsLoading(false);
      }
    };
    
    initializeAuth();
  }, []);

  // Set axios default authorization header when token changes
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  // Signup function
  const signup = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    
    try {
      const response = await axios.post(`${API_URL}/auth/register`, {
        email, 
        password, 
        name
      });
      
      const { user: userData, token: authToken } = response.data;
      
      if (!userData || !authToken) {
        throw new Error('Invalid response from server');
      }
      
      // Transform user data to match our User type
      const formattedUser: User = {
        id: userData.id,
        email: userData.email,
        name: userData.name || '',
        role: userData.role || 'student',
        joinedOn: userData.created_at || new Date().toISOString(),
        avatar_url: userData.avatar_url || null,
        coursesEnrolled: userData.courses_enrolled || 0,
        videosWatched: userData.videos_watched || 0,
        feedbackGiven: userData.feedback_given || 0,
        hoursSpent: userData.hours_spent || 0
      };
      
      // Set user and token
      setUser(formattedUser);
      setToken(authToken);
      
      // Store in localStorage
      localStorage.setItem('authToken', authToken);
      localStorage.setItem('authUser', JSON.stringify(formattedUser));
      
      toast.success('Signed up successfully');
      
      // Navigate to appropriate dashboard
      if (formattedUser.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (error: any) {
      console.error('Signup error:', error);
      toast.error(error.response?.data?.message || 'Cannot create account');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Login function
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password
      });
      
      const { user: userData, token: authToken } = response.data;
      
      if (!userData || !authToken) {
        throw new Error('Invalid login response from server');
      }
      
      // Transform user data to match our User type
      const formattedUser: User = {
        id: userData.id,
        email: userData.email,
        name: userData.name || '',
        role: userData.role || 'student',
        joinedOn: userData.created_at || new Date().toISOString(),
        avatar_url: userData.avatar_url || null,
        coursesEnrolled: userData.courses_enrolled || 0,
        videosWatched: userData.videos_watched || 0,
        feedbackGiven: userData.feedback_given || 0,
        hoursSpent: userData.hours_spent || 0
      };
      
      // Set user and token
      setUser(formattedUser);
      setToken(authToken);
      
      // Store in localStorage
      localStorage.setItem('authToken', authToken);
      localStorage.setItem('authUser', JSON.stringify(formattedUser));
      
      toast.success('Signed in successfully');
      
      // Navigate to appropriate dashboard
      if (formattedUser.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.response?.data?.message || 'Invalid login credentials');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    setIsLoading(true);
    
    try {
      // Clear state
      setUser(null);
      setToken(null);
      
      // Clear localStorage
      localStorage.removeItem('authToken');
      localStorage.removeItem('authUser');
      
      toast.success('Signed out successfully');
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Error signing out');
    } finally {
      setIsLoading(false);
    }
  };

  // Update user profile
  const updateUserProfile = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('authUser', JSON.stringify(updatedUser));
    }
  };

  const value = {
    user,
    token,
    isLoading,
    isAuthenticated: !!user, // Compute isAuthenticated from user state
    login,
    signup,
    logout,
    updateUserProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
