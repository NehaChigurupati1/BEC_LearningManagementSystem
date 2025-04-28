
import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/providers/AuthProvider';
import { toast } from 'sonner';

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();
  const [isAdmin, setIsAdmin] = useState(false);
  const redirectAttempted = React.useRef(false);

  useEffect(() => {
    if (user) {
      console.log("AdminRoute: Verifying admin role for user:", user);
      
      // Check if user has admin role
      if (user.role === 'admin') {
        console.log("AdminRoute: User confirmed as admin");
        setIsAdmin(true);
        redirectAttempted.current = false;
      } else {
        console.log("AdminRoute: User is not an admin:", user);
        toast.error("You need admin privileges to access this page");
        setIsAdmin(false);
      }
    } else {
      setIsAdmin(false);
    }
  }, [user]);

  useEffect(() =>{
    return() =>{
      redirectAttempted.current=false;
    };
  },[location.pathname]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  // If no user, redirect to login
  if (!user && !redirectAttempted.current) {
    redirectAttempted.current = true;
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // If user but not admin, redirect to dashboard
  if (!isAdmin && !redirectAttempted.current && user) {
    redirectAttempted.current = true;
    return <Navigate to="/dashboard" replace />;
  }

  // If admin, show children (admin dashboard)
  return <>{children}</>;
};

export default AdminRoute;
