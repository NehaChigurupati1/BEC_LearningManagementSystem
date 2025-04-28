
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useAuth } from '@/providers/AuthProvider';
import { Separator } from '@/components/ui/separator';
import { Loader2 } from 'lucide-react';

interface AuthFormProps {
  type: 'login' | 'register';
  onSubmit: (email: string, password: string, name?: string) => Promise<void>;
  isLoading?: boolean;
}

const AuthForm: React.FC<AuthFormProps> = ({ type, onSubmit, isLoading = false }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [formIsLoading, setFormIsLoading] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);

  // Use either the provided isLoading prop or the internal state
  const loading = isLoading || formIsLoading;

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      console.log("User is already logged in:", user);
      const from = location.state?.from || (user.role === 'admin' ? '/admin' : '/dashboard');
      console.log("Redirecting authenticated user to:", from);
      navigate(from, { replace: true });
    }
  }, [user, navigate, location]);

  // Clear login attempts after 2 minutes
  useEffect(() => {
    if (loginAttempts > 0) {
      const timer = setTimeout(() => {
        setLoginAttempts(0);
      }, 120000);
      return () => clearTimeout(timer);
    }
  }, [loginAttempts]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormIsLoading(true);
    
    try {
      if (!onSubmit) {
        // This is a fallback if no onSubmit is provided
        console.error('No onSubmit handler provided');
        toast.error('Authentication handler not properly configured');
        return;
      }

      if (type === 'login') {
        // Track login attempts
        setLoginAttempts(prev => prev + 1);
        
        // If too many attempts, show warning
        if (loginAttempts >= 5) {
          toast.warning('Too many login attempts. Please wait before trying again.', { duration: 5000 });
          setFormIsLoading(false);
          return;
        }

        await onSubmit(email, password);
      } else {
        // Register
        if (!name) {
          toast.error('Please enter your name', { duration: 3000 });
          setFormIsLoading(false);
          return;
        }
        
        await onSubmit(email, password, name);
      }
    } catch (error: any) {
      console.error('Authentication error:', error);
      
      // Provide more helpful error messages
      if (error.message?.includes('Invalid login credentials')) {
        toast.error('Invalid email or password. Please check your credentials and try again.', { duration: 5000 });
      } else if (error.message?.includes('already registered')) {
        toast.error('This email is already registered. Please log in instead.', { duration: 5000 });
      } else if (error.message?.includes('rate limit')) {
        toast.error('Too many login attempts. Please try again later.', { duration: 5000 });
      } else {
        toast.error(error.message || 'Authentication failed', { duration: 5000 });
      }
    } finally {
      setFormIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const form = e.currentTarget.closest('form');
      if (form) {
        form.requestSubmit();
      }
    }
  };

  return (
    <div className="space-y-6 w-full max-w-sm">
      <form onSubmit={handleSubmit} className="space-y-6">
        {type === 'register' && (
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={handleKeyDown}
              required
              className="transition-all duration-200"
              placeholder="Enter your full name"
            />
          </div>
        )}
        
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={handleKeyDown}
            required
            className="transition-all duration-200"
            placeholder="Enter your email"
            autoComplete="email"
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            {type === 'login' && (
              <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                Forgot password?
              </Link>
            )}
          </div>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handleKeyDown}
            required
            className="transition-all duration-200"
            placeholder="Enter your password"
            autoComplete={type === 'login' ? 'current-password' : 'new-password'}
          />
        </div>
        
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? (
            <span className="flex items-center">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {type === 'login' ? 'Signing in...' : 'Creating account...'}
            </span>
          ) : (
            <span>{type === 'login' ? 'Sign in' : 'Create account'}</span>
          )}
        </Button>
        
        <div className="text-center text-sm">
          {type === 'login' ? (
            <div>
              Don't have an account?{' '}
              <Link to="/register" className="text-primary hover:underline">
                Sign up
              </Link>
            </div>
          ) : (
            <div>
              Already have an account?{' '}
              <Link to="/login" className="text-primary hover:underline">
                Sign in
              </Link>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default AuthForm;
