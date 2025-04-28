
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { useAuth } from '@/providers/AuthProvider';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Clock, Edit, LogOut, User } from 'lucide-react';
import axios from 'axios';

const Profile: React.FC = () => {
  const { user, logout, updateUserProfile } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignOut = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Failed to sign out');
    }
  };
  
  const handleUpdateProfile = async () => {
    if (!name.trim()) {
      toast.error('Name cannot be empty');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Make API request to update user profile
      await axios.put('http://localhost:8000/api/users/me', { name });
      
      // Update local state
      updateUserProfile({ name });
      
      toast.success('Profile updated successfully');
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };
  
  const cancelEditing = () => {
    setIsEditing(false);
    setName(user?.name || '');
  };

  if (!user) {
    return null; // Should be handled by ProtectedRoute
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">My Profile</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>User Information</CardTitle>
                <CardDescription>View and edit your account details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {isEditing ? (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input 
                        id="name" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email" 
                        value={email} 
                        disabled 
                      />
                      <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center space-x-2 pb-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Full Name:</span>
                      <span>{user.name}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2 pb-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Member Since:</span>
                      <span>{new Date(user.joinedOn).toLocaleDateString()}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2 pb-2">
                      <span className="text-sm font-medium">Email:</span>
                      <span>{user.email}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">Account Type:</span>
                      <span className="capitalize">{user.role}</span>
                    </div>
                  </>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                {isEditing ? (
                  <>
                    <Button variant="outline" onClick={cancelEditing} disabled={isLoading}>Cancel</Button>
                    <Button onClick={handleUpdateProfile} disabled={isLoading}>
                      {isLoading ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="outline" onClick={handleSignOut}>
                      <LogOut className="mr-2 h-4 w-4" /> Sign Out
                    </Button>
                    <Button onClick={() => setIsEditing(true)}>
                      <Edit className="mr-2 h-4 w-4" /> Edit Profile
                    </Button>
                  </>
                )}
              </CardFooter>
            </Card>
          </div>
          
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Account Statistics</CardTitle>
                <CardDescription>Your activity summary</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center pb-2">
                  <span className="text-sm font-medium">Courses Enrolled:</span>
                  <span className="text-lg">{user.coursesEnrolled || 0}</span>
                </div>
                <div className="flex justify-between items-center pb-2">
                  <span className="text-sm font-medium">Videos Watched:</span>
                  <span className="text-lg">{user.videosWatched || 0}</span>
                </div>
                <div className="flex justify-between items-center pb-2">
                  <span className="text-sm font-medium">Hours Spent:</span>
                  <span className="text-lg">{user.hoursSpent || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Feedback Given:</span>
                  <span className="text-lg">{user.feedbackGiven || 0}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
