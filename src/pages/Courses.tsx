
import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import Layout from '@/components/Layout';
import CourseCard from '@/components/CourseCard';
import { Input } from '@/components/ui/input';
import { getAllCourses } from '@/services/courseService';
import { Course } from '@/lib/types';
import { toast } from 'sonner';

const Courses: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const { data: courses = [], isLoading, error, refetch } = useQuery({
    queryKey: ['courses'],
    queryFn: getAllCourses,
    meta: {
      onError: (error: any) => {
        console.error("Error fetching courses:", error);
        toast.error("Failed to load courses. Please try again.");
      }
    }
  });

  useEffect(() => {
    // Log the courses data for debugging
    console.log("Courses data:", courses);
  }, [courses]);

  const filteredCourses = courses.filter(course => 
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.instructor.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRetry = () => {
    toast.info("Retrying course fetch...");
    refetch();
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="mb-12 animate-fade-in">
          <h1 className="text-3xl font-bold mb-6">All Courses</h1>
          <div className="max-w-md mb-8 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="text"
              placeholder="Search courses by title, description, or instructor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          {isLoading ? (
            <div className="py-20 text-center">
              <div className="inline-block animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mb-4"></div>
              <p className="text-muted-foreground">Loading courses...</p>
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground mb-4">There was an error loading the courses.</p>
              <button 
                onClick={handleRetry}
                className="text-primary hover:underline"
              >
                Try again
              </button>
            </div>
          ) : courses.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground mb-4">No courses available yet.</p>
              <p className="text-muted-foreground">Please check back later or contact the administrator.</p>
            </div>
          ) : filteredCourses.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground mb-4">No courses found matching your search criteria.</p>
              <button 
                onClick={() => setSearchQuery('')}
                className="text-primary hover:underline"
              >
                Clear search
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCourses.map((course, index) => (
                <div key={course.id} className="animate-fade-in" style={{ animationDelay: `${Math.min(index * 100, 500)}ms` }}>
                  <CourseCard course={course} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Courses;
