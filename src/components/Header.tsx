
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, LogIn, User, Home, BookOpen, Settings, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ThemeToggle from './ThemeToggle';
import { useAuth } from '@/providers/AuthProvider';
import { toast } from 'sonner';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  const isLoggedIn = !!user;
  const isAdmin = user?.role === 'admin';

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSignOut = async () => {
    try {
      await logout();
      toast.success('Signed out successfully');
      navigate('/');
    } catch (error) {
      toast.error('Error signing out');
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/40">
      <div className="container flex items-center justify-between h-16 px-4 mx-auto">
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            BEC's LMS
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          <Link 
            to="/"
            className="px-4 py-2 text-sm font-medium rounded-md transition-colors hover:bg-muted/50"
          >
            Home
          </Link>
          <Link 
            to="/courses"
            className="px-4 py-2 text-sm font-medium rounded-md transition-colors hover:bg-muted/50"
          >
            Courses
          </Link>
          
          {isLoggedIn ? (
            <>
              {isAdmin ? (
                <Link 
                  to="/admin"
                  className="px-4 py-2 text-sm font-medium rounded-md transition-colors hover:bg-muted/50"
                >
                  Admin Dashboard
                </Link>
              ) : (
                <Link 
                  to="/dashboard"
                  className="px-4 py-2 text-sm font-medium rounded-md transition-colors hover:bg-muted/50"
                >
                  My Dashboard
                </Link>
              )}
              <div className="flex items-center space-x-2">
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/profile')}
                >
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Button>
                <Button 
                  variant="ghost" 
                  onClick={handleSignOut}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </Button>
              </div>
            </>
          ) : (
            <Button 
              variant="default" 
              className="ml-2"
              onClick={() => navigate('/login')}
            >
              <LogIn className="mr-2 h-4 w-4" />
              Login
            </Button>
          )}
          <ThemeToggle />
        </nav>

        {/* Mobile Navigation Button */}
        <div className="flex items-center md:hidden">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            className="ml-2"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 z-50 bg-background border-b border-border/40 animate-slide-in-down">
          <div className="container px-4 py-2 mx-auto space-y-1">
            <Link 
              to="/"
              className="flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors hover:bg-muted/50"
              onClick={() => setIsMenuOpen(false)}
            >
              <Home className="mr-2 h-4 w-4" />
              Home
            </Link>
            <Link 
              to="/courses"
              className="flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors hover:bg-muted/50"
              onClick={() => setIsMenuOpen(false)}
            >
              <BookOpen className="mr-2 h-4 w-4" />
              Courses
            </Link>
            
            {isLoggedIn ? (
              <>
                {isAdmin ? (
                  <Link 
                    to="/admin"
                    className="flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors hover:bg-muted/50"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    Admin Dashboard
                  </Link>
                ) : (
                  <Link 
                    to="/dashboard"
                    className="flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors hover:bg-muted/50"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User className="mr-2 h-4 w-4" />
                    My Dashboard
                  </Link>
                )}
                <Link 
                  to="/profile"
                  className="flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors hover:bg-muted/50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Link>
                <button 
                  className="flex items-center w-full px-4 py-2 text-sm font-medium rounded-md transition-colors hover:bg-muted/50 text-left"
                  onClick={() => {
                    setIsMenuOpen(false);
                    handleSignOut();
                  }}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </button>
              </>
            ) : (
              <Link 
                to="/login"
                className="flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors hover:bg-muted/50"
                onClick={() => setIsMenuOpen(false)}
              >
                <LogIn className="mr-2 h-4 w-4" />
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
