
import React, { useEffect, useRef } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/providers/AuthProvider';
import { toast } from 'sonner';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();
  const loginToastShown = useRef(false);
  const authCheckComplete = useRef(false);
  const redirectAttempted = useRef(false);

  useEffect(() => {
    console.log("ProtectedRoute: User authenticated state:", !!user);
    console.log("ProtectedRoute: Current path:", location.pathname);
    console.log("ProtectedRoute: User role:", user?.role);
    
    // Check if this is an auth page
    const isAuthPage = location.pathname === '/login' || 
                      location.pathname === '/register' || 
                      location.pathname === '/forgot-password' || 
                      location.pathname === '/reset-password';
    
    // Show login toast only when auth check is complete, user is not authenticated
    // and we're not on an auth page, and we haven't shown the toast already
    if (!isLoading) {
      authCheckComplete.current = true;
      
      if (!user && !isAuthPage && !loginToastShown.current) {
        // Only show toast if user is not coming from register page (to avoid the double toast)
        const fromRegister = location.state && location.state.from === '/register';
        
        if (!fromRegister) {
          toast.dismiss(); // Dismiss any existing toasts
          toast.error('Please log in to access this page', { duration: 3000 });
          loginToastShown.current = true;
        }
      }
    }
    
    // Reset the toast flag when user becomes authenticated
    if (user) {
      loginToastShown.current = false;
    }
    
  }, [user, location.pathname, isLoading, location.state]);
  
  // Reset the toast reference when route changes
  useEffect(() => {
    return () => {
      loginToastShown.current = false;
      authCheckComplete.current = false;
      redirectAttempted.current=false;
    };
  }, [location.pathname]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  // Check if this is one of the auth pages
  const isAuthPage = location.pathname === '/login' || 
                    location.pathname === '/register' || 
                    location.pathname === '/forgot-password' || 
                    location.pathname === '/reset-password';
  
  if (!user) {
    console.log("ProtectedRoute: No user found, redirecting to login");
    // Only redirect to login if we're not already on an auth page
    if (!isAuthPage) {
      return <Navigate to="/login" state={{ from: location.pathname }} replace />;
    }
  } else if (isAuthPage) {
    // If user is logged in and tries to access an auth page, redirect them to dashboard
    console.log("ProtectedRoute: User is authenticated but on auth page, redirecting to dashboard");
    const dashboardPath = user.role === 'admin' ? '/admin' : '/dashboard';
    return <Navigate to={dashboardPath} replace />;
  } else if (user.role === 'admin' && location.pathname === '/dashboard') {
    // If admin tries to access regular dashboard, redirect to admin dashboard
    console.log("ProtectedRoute: Admin trying to access regular dashboard, redirecting to admin dashboard");
    if (!redirectAttempted.current) {
      redirectAttempted.current = true;
      return <Navigate to="/admin" replace />;
    }
  }
  
  console.log("ProtectedRoute: User authenticated:", user);
  return <>{children}</>;
};

export default ProtectedRoute;
