
import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getAllCourses } from '@/services/courseService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Dialog, 
  DialogContent, 
  DialogTitle,
  DialogTrigger 
} from '@/components/ui/dialog';
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react';
import AddCourseForm from './AddCourseForm';
import { toast } from 'sonner';
import { deleteCourse } from '@/services/adminService';
import { Course } from '@/lib/types';

const CourseManagement: React.FC = () => {
  const [isAddCourseOpen, setIsAddCourseOpen] = useState(false);
  const [deletingCourseId, setDeletingCourseId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  // Get all courses with improved error handling and logging
  const { data: courses = [], isLoading, error, refetch } = useQuery({
    queryKey: ['adminCourses'],
    queryFn: getAllCourses,
    refetchInterval: 10000, // Refresh every 10 seconds
    meta: {
      onError: (error: any) => {
        toast.error('Failed to load courses: ' + error.message, { duration: 3000 });
        console.error('Failed to load courses:', error);
      }
    }
  });

  const handleCourseAdded = () => {
    setIsAddCourseOpen(false);
    // Refresh the courses data
    queryClient.invalidateQueries({ queryKey: ['adminCourses'] });
    queryClient.invalidateQueries({ queryKey: ['courses'] });
    toast.success('Course added successfully', { duration: 3000 });
  };

  const handleDeleteCourse = async (courseId: string) => {
    if (!confirm("Are you sure you want to delete this course? This action cannot be undone.")) {
      return;
    }

    setDeletingCourseId(courseId);
    toast.dismiss(); // Clear any existing toasts
    
    try {
      await deleteCourse(courseId);
      toast.success('Course deleted successfully', { duration: 3000 });
      
      // Refresh all related queries
      queryClient.invalidateQueries({ queryKey: ['adminCourses'] });
      queryClient.invalidateQueries({ queryKey: ['courses'] }); 
      queryClient.invalidateQueries({ queryKey: ['adminDashboardStats'] });
    } catch (error: any) {
      toast.error(`Error: ${error.message}`, { duration: 3000 });
    } finally {
      setDeletingCourseId(null);
    }
  };

  if (error) {
    return (
      <div className="text-center py-10">
        <div className="text-destructive mb-4">Failed to load courses</div>
        <Button onClick={() => refetch()}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Course Management</h2>
        <Dialog open={isAddCourseOpen} onOpenChange={setIsAddCourseOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Course
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogTitle>Add New Course</DialogTitle>
            <AddCourseForm onSuccess={handleCourseAdded} />
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : courses.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-10 text-center">
            <p className="text-muted-foreground mb-4">No courses found</p>
            <Button onClick={() => setIsAddCourseOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> Create your first course
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {courses.map((course: Course) => (
            <Card key={course.id} className="overflow-hidden">
              <div className="flex h-full">
                {course.thumbnail && (
                  <div className="w-1/4 min-w-[120px] bg-cover bg-center" style={{
                    backgroundImage: `url(${course.thumbnail})`
                  }} />
                )}
                <div className="flex-grow p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-semibold mb-2">{course.title}</h3>
                      <p className="text-sm text-muted-foreground mb-2">Instructor: {course.instructor}</p>
                      <p className="text-sm line-clamp-2">{course.description}</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="icon">
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        onClick={() => handleDeleteCourse(course.id)}
                        disabled={deletingCourseId === course.id}
                      >
                        {deletingCourseId === course.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4 text-destructive" />
                        )}
                      </Button>
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-sm">
                      <span className="font-medium">{course.weeks?.length || 0}</span> weeks
                      {' • '}
                      <span className="font-medium">
                        {course.weeks?.reduce((total, week) => total + (week.topics?.length || 0), 0) || 0}
                      </span> topics
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default CourseManagement;
