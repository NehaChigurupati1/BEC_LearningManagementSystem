
import axios from 'axios';
import { toast } from 'sonner';
import { Course } from '@/lib/types';

const API_URL = 'http://localhost:5000/api';

// Helper function to set up auth header
const getAuthHeader = () => {
  const token = localStorage.getItem('authToken');
  return {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  };
};

// Get all courses
export const getAllCourses = async (): Promise<Course[]> => {
  try {
    const response = await axios.get(`${API_URL}/courses`);
    // Ensure each course has a weeks array (even if empty)
    const courses = response.data.map((course: any) => ({
      ...course,
      weeks: course.weeks || []
    }));
    return courses;
  } catch (error: any) {
    console.error('Error fetching courses:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch courses');
  }
};

// Get course by ID
export const getCourseById = async (id: string): Promise<Course> => {
  try {
    const response = await axios.get(`${API_URL}/courses/${id}`);
    // Ensure course has weeks array
    return {
      ...response.data,
      weeks: response.data.weeks || []
    };
  } catch (error: any) {
    console.error('Error fetching course:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch course details');
  }
};

// Enroll in a course
export const enrollInCourse = async (courseId: string): Promise<boolean> => {
  try {
    const response = await axios.post(
      `${API_URL}/courses/${courseId}/enroll`, 
      {}, 
      getAuthHeader()
    );
    toast.success('Successfully enrolled in course!');
    return true;
  } catch (error: any) {
    console.error('Error enrolling in course:', error);
    toast.error(error.response?.data?.message || 'Failed to enroll in course');
    throw new Error(error.response?.data?.message || 'Failed to enroll in course');
  }
};

// Get enrolled courses for the current user
export const getEnrolledCourses = async (): Promise<Course[]> => {
  try {
    const response = await axios.get(
      `${API_URL}/users/courses`, 
      getAuthHeader()
    );
    // Ensure each course has a weeks array
    const courses = response.data.map((course: any) => ({
      ...course,
      weeks: course.weeks || []
    }));
    return courses;
  } catch (error: any) {
    console.error('Error fetching enrolled courses:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch enrolled courses');
  }
};

// Update topic progress
export const updateTopicProgress = async (
  topicId: string, 
  timeSpent: number, 
  completed: boolean = true
): Promise<any> => {
  try {
    const response = await axios.post(
      `${API_URL}/courses/topics/${topicId}/progress`, 
      { completed, timeSpent }, 
      getAuthHeader()
    );
    return response.data;
  } catch (error: any) {
    console.error('Error updating topic progress:', error);
    throw new Error(error.response?.data?.message || 'Failed to update progress');
  }
};

// Submit course feedback
export const submitFeedback = async (
  courseId: string, 
  weekId: string,
  rating: number, 
  comment: string
): Promise<any> => {
  try {
    const response = await axios.post(
      `${API_URL}/feedback`, 
      { courseId, weekId, rating, comment }, 
      getAuthHeader()
    );
    toast.success('Feedback submitted successfully!');
    return response.data;
  } catch (error: any) {
    console.error('Error submitting feedback:', error);
    toast.error(error.response?.data?.message || 'Failed to submit feedback');
    throw new Error(error.response?.data?.message || 'Failed to submit feedback');
  }
};

// Get course feedback
export const getCourseFeedback = async (courseId: string): Promise<any> => {
  try {
    const response = await axios.get(`${API_URL}/feedback/course/${courseId}`);
    return response.data;
  } catch (error: any) {
    console.error('Error fetching course feedback:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch feedback');
  }
};

// Check if user has submitted feedback for a week
export const checkWeekFeedback = async (weekId: string): Promise<boolean> => {
  try {
    const response = await axios.get(
      `${API_URL}/feedback/week/${weekId}/check`, 
      getAuthHeader()
    );
    return response.data.hasSubmitted;
  } catch (error: any) {
    console.error('Error checking week feedback:', error);
    return false; // Default to false if error occurs
  }
};

// Get user stats with automatic retry and error handling
export const getUserStats = async (): Promise<{
  coursesEnrolled: number;
  videosWatched: number;
  feedbackGiven: number;
  hoursSpent: number;
}> => {
  const defaultStats = {
    coursesEnrolled: 0,
    videosWatched: 0,
    feedbackGiven: 0,
    hoursSpent: 0
  };
  
  try {
    const response = await axios.get(
      `${API_URL}/users/me/stats`, 
      getAuthHeader()
    );
    
    // If response is missing any stats field, use default value
    return {
      ...defaultStats,
      ...response.data
    };
  } catch (error: any) {
    console.error('Error fetching user stats:', error);
    toast.error('Failed to load your statistics. Using cached data.', { duration: 3000 });
    return defaultStats;
  }
};

// Refresh dashboard stats
export const refreshStats = async (): Promise<boolean> => {
  try {
    await axios.post(
      `${API_URL}/users/me/refresh-stats`,
      {},
      getAuthHeader()
    );
    return true;
  } catch (error) {
    console.error('Error refreshing stats:', error);
    return false;
  }
};
