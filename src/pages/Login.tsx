
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Layout from '@/components/Layout';
import AuthForm from '@/components/AuthForm';
import { toast } from 'sonner';
import { useAuth } from '@/providers/AuthProvider';

const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (email: string, password: string) => {
    if (!email || !password) {
      toast.error("Please enter both email and password", { duration: 3000 });
      return;
    }
    
    setIsLoading(true);
    
    try {
      await login(email, password);
      
      // The redirect will be handled in the useEffect in AuthForm
      // but we also handle it here as a fallback
      const from = location.state?.from || '/dashboard';
      navigate(from, { replace: true });
    } catch (error) {
      console.error("Login error:", error);
      // Toast errors already shown in the AuthProvider
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout hideHeader>
      <div className="h-screen flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-radial from-blue-500/20 to-purple-500/30 opacity-20 z-0" />
        <div className="max-w-md w-full mx-auto p-6 bg-background rounded-xl shadow-lg relative z-10">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold">Welcome back!</h1>
            <p className="text-muted-foreground">Sign in to your account</p>
          </div>
          
          <AuthForm 
            type="login"
            onSubmit={handleLogin}
            isLoading={isLoading}
          />
        </div>
      </div>
    </Layout>
  );
};

export default Login;
