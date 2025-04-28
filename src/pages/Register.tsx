
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import AuthForm from '@/components/AuthForm';
import { toast } from 'sonner';
import { useAuth } from '@/providers/AuthProvider';

const Register: React.FC = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (email: string, password: string, name?: string) => {
    if (!email || !password || !name) {
      toast.error("All fields are required", { duration: 3000 });
      return;
    }
    
    setIsLoading(true);
    
    try {
      await signup(email, password, name);
      
      // Redirect is handled in AuthProvider after signup
      // but we also handle it here as a fallback
      toast.success("Registration successful! Redirecting to dashboard...", { duration: 3000 });
      navigate('/dashboard', { replace: true });
    } catch (error) {
      console.error("Registration error:", error);
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
            <h1 className="text-2xl font-bold">Create an account</h1>
            <p className="text-muted-foreground">Sign up to get started</p>
          </div>
          
          <AuthForm 
            type="register"
            onSubmit={handleRegister}
            isLoading={isLoading}
          />
        </div>
      </div>
    </Layout>
  );
};

export default Register;
