import React, { useEffect } from 'react';
import { BookOpen, CheckCircle, Clock, MessageSquare, RefreshCw } from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import CourseCard from '@/components/CourseCard';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/providers/AuthProvider';
import { getEnrolledCourses, getUserStats, refreshStats } from '@/services/courseService';

// Define UserStats type
type UserStats = {
  coursesEnrolled: number;
  videosWatched: number;
  hoursSpent: number;
  feedbackGiven: number;
};

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Set up auto-refresh of user stats every minute
  useEffect(() => {
    const intervalId = setInterval(() => {
      refreshStats().then(success => {
        if (success) {
          // Successfully refreshed stats on the backend
          // Now refresh the frontend data
          queryClient.invalidateQueries({ queryKey: ['userStats'] });
          queryClient.invalidateQueries({ queryKey: ['enrolledCourses'] });
        }
      });
    }, 60000); // Every minute
    
    return () => clearInterval(intervalId);
  }, [queryClient]);
  
  const { data: enrolledCourses = [], isLoading: coursesLoading, refetch: refetchCourses } = useQuery({
    queryKey: ['enrolledCourses'],
    queryFn: getEnrolledCourses,
    enabled: !!user,
    meta: {
      onError: (error: any) => {
        toast.error('Failed to load your courses: ' + error.message);
      }
    }
  });

  const { 
    data: stats = { 
      videosWatched: 0, 
      hoursSpent: 0, 
      feedbackGiven: 0, 
      coursesEnrolled: 0 
    }, 
    isLoading: statsLoading,
    refetch: refetchStats
  } = useQuery<UserStats>({
    queryKey: ['userStats'],
    queryFn: getUserStats,
    enabled: !!user,
    refetchInterval: 30000, // Refresh stats every 30 seconds
    meta: {
      onError: (error: any) => {
        toast.error('Failed to load your statistics: ' + error.message);
      }
    }
  });

  const isLoading = coursesLoading || statsLoading;
  
  const handleRefresh = async () => {
    toast.info('Refreshing your dashboard data...');
    
    // First refresh stats on the backend
    const success = await refreshStats();
    
    if (success) {
      // Then refresh the frontend data
      await Promise.all([
        refetchStats(),
        refetchCourses()
      ]);
      toast.success('Dashboard refreshed!');
    } else {
      toast.error('Failed to refresh data. Please try again.');
    }
  };

  if (!user) {
    return null; // Should be handled by ProtectedRoute
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 animate-fade-in">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome, {user.name || 'Student'}</h1>
            <p className="text-muted-foreground">Here's an overview of your learning progress</p>
          </div>
          <Button onClick={handleRefresh} variant="outline" className="mt-4 md:mt-0">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Data
          </Button>
        </div>

        {isLoading ? (
          <div className="py-12 text-center">
            <div className="inline-block animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mb-4"></div>
            <p className="text-muted-foreground">Loading your dashboard...</p>
          </div>
        ) : (
          <>
            {/* Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              <Card className="animate-fade-in">
                <CardHeader className="pb-2">
                  <CardDescription>Enrolled Courses</CardDescription>
                  <CardTitle className="text-3xl">{stats.coursesEnrolled}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-muted-foreground">
                    <BookOpen className="h-4 w-4 mr-2" />
                    <span className="text-sm">Active courses</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="animate-fade-in delay-100">
                <CardHeader className="pb-2">
                  <CardDescription>Videos Watched</CardDescription>
                  <CardTitle className="text-3xl">{stats.videosWatched}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-muted-foreground">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    <span className="text-sm">Completed lessons</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="animate-fade-in delay-200">
                <CardHeader className="pb-2">
                  <CardDescription>Hours Spent</CardDescription>
                  <CardTitle className="text-3xl">{stats.hoursSpent}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-muted-foreground">
                    <Clock className="h-4 w-4 mr-2" />
                    <span className="text-sm">Total learning time</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="animate-fade-in delay-300">
                <CardHeader className="pb-2">
                  <CardDescription>Feedback Given</CardDescription>
                  <CardTitle className="text-3xl">{stats.feedbackGiven}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-muted-foreground">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    <span className="text-sm">Course feedback</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* My Courses Section */}
            <div className="mb-12">
              <h2 className="text-2xl font-semibold mb-6 animate-fade-in">My Courses</h2>
              
              {enrolledCourses.length === 0 ? (
                <div className="text-center py-10 border border-dashed border-border rounded-lg">
                  <BookOpen className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No courses yet</h3>
                  <p className="text-muted-foreground mb-4">You haven't enrolled in any courses yet</p>
                  <button 
                    onClick={() => location.href = '/courses'}
                    className="text-primary hover:underline"
                  >
                    Browse available courses
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {enrolledCourses.map((course, index) => (
                    <div key={course.id} className={`animate-fade-in delay-${index * 100}`}>
                      <CourseCard course={course} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;
