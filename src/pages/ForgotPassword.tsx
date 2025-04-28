
import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check if this is a reset password page with a token
  const searchParams = new URLSearchParams(location.search);
  const resetToken = searchParams.get('token');
  const isReset = location.pathname === '/reset-password' || !!resetToken;

  const handleResetRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }
    
    setIsLoading(true);
    
    try {
      await axios.post(`${API_URL}/auth/forgot-password`, { email });
      setResetSent(true);
      toast.success('Password reset email sent. Please check your inbox.');
    } catch (error: any) {
      console.error('Error requesting password reset:', error);
      toast.error(error.response?.data?.message || 'Failed to send reset email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || !confirmPassword) {
      toast.error('Please enter and confirm your new password');
      return;
    }
    
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }
    
    setIsLoading(true);
    
    try {
      await axios.post(`${API_URL}/auth/reset-password`, { 
        token: resetToken,
        password
      });
      
      toast.success('Password reset successful. You can now login with your new password.');
      setTimeout(() => navigate('/login'), 1500);
    } catch (error: any) {
      console.error('Error resetting password:', error);
      toast.error(error.response?.data?.message || 'Failed to reset password. The link may be invalid or expired.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout hideHeader>
      <div className="h-screen flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-radial from-blue-500/20 to-purple-500/30 opacity-20 z-0" />
        <div className="max-w-md w-full mx-auto p-6 bg-background rounded-xl shadow-lg relative z-10">
          <Card>
            <CardHeader className="space-y-1">
              <div className="flex items-center justify-between">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-9 h-9 p-0" 
                  onClick={() => navigate('/login')}
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </div>
              <CardTitle className="text-2xl">
                {isReset ? 'Reset Password' : 'Forgot Password'}
              </CardTitle>
              <CardDescription>
                {isReset 
                  ? 'Enter your new password below.' 
                  : 'Enter your email to receive a password reset link.'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {resetSent ? (
                <div className="p-4 rounded-md border bg-muted text-center">
                  <h3 className="font-medium mb-1">Check your email</h3>
                  <p className="text-sm text-muted-foreground">
                    We've sent you an email with a link to reset your password.
                  </p>
                </div>
              ) : isReset ? (
                <form onSubmit={handlePasswordReset} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium" htmlFor="password">
                      New Password
                    </label>
                    <Input
                      type="password"
                      id="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium" htmlFor="confirm-password">
                      Confirm Password
                    </label>
                    <Input
                      type="password"
                      id="confirm-password"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      minLength={6}
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                        Resetting...
                      </>
                    ) : (
                      'Reset Password'
                    )}
                  </Button>
                </form>
              ) : (
                <form onSubmit={handleResetRequest} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium" htmlFor="email">
                      Email
                    </label>
                    <Input
                      type="email"
                      id="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                        Sending...
                      </>
                    ) : (
                      'Send Reset Link'
                    )}
                  </Button>
                </form>
              )}
            </CardContent>
            <CardFooter className="border-t pt-4 text-center">
              <div className="w-full text-sm text-muted-foreground">
                Remember your password?{" "}
                <Link to="/login" className="text-primary hover:underline">
                  Log in
                </Link>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default ForgotPassword;
