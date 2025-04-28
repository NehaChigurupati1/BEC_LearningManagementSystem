
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Setup request interceptor to add token
axios.interceptors.request.use(
  config => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// Get dashboard statistics for admin
export const getDashboardStats = async () => {
  try {
    const response = await axios.get(`${API_URL}/admin/dashboard`);
    return response.data;
  } catch (error: any) {
    console.error('Error fetching dashboard stats:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch dashboard statistics');
  }
};

// Get all users (admin only)
export const getAllUsers = async () => {
  try {
    const response = await axios.get(`${API_URL}/admin/users`);
    return response.data;
  } catch (error: any) {
    console.error('Error fetching users:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch users');
  }
};

// Create a new user (admin only)
export const createUser = async (userData: any) => {
  try {
    const response = await axios.post(`${API_URL}/admin/users`, userData);
    return response.data;
  } catch (error: any) {
    console.error('Error creating user:', error);
    throw new Error(error.response?.data?.message || 'Failed to create user');
  }
};

// Get feedback entries (admin only)
export const getAllFeedback = async () => {
  try {
    const response = await axios.get(`${API_URL}/admin/feedback`);
    return response.data;
  } catch (error: any) {
    console.error('Error fetching feedback:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch feedback entries');
  }
};

// Create a new course (admin only)
export const createCourse = async (formData: FormData) => {
  try {
    console.log("Sending course creation request with data:", Object.fromEntries(formData.entries()));
    const response = await axios.post(`${API_URL}/admin/courses`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error: any) {
    console.error('Error creating course:', error);
    throw new Error(error.response?.data?.message || 'Failed to create course');
  }
};

// Update a course (admin only)
export const updateCourse = async (courseId: string, formData: FormData) => {
  try {
    const response = await axios.put(`${API_URL}/courses/${courseId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error: any) {
    console.error('Error updating course:', error);
    throw new Error(error.response?.data?.message || 'Failed to update course');
  }
};

// Delete a course (admin only)
export const deleteCourse = async (courseId: string) => {
  try {
    const response = await axios.delete(`${API_URL}/courses/${courseId}`);
    return response.data;
  } catch (error: any) {
    console.error('Error deleting course:', error);
    throw new Error(error.response?.data?.message || 'Failed to delete course');
  }
};

// Update user role (admin only)
export const updateUserRole = async (userId: string, role: 'admin' | 'student') => {
  try {
    const response = await axios.patch(`${API_URL}/admin/users/${userId}/role`, { role });
    return { success: true, error: null };
  } catch (error: any) {
    console.error('Error updating user role:', error);
    return { success: false, error: error.response?.data || { message: 'Failed to update user role' } };
  }
};

// Get user engagement data for charts
export const getUserEngagementData = async () => {
  try {
    console.log('Fetching user engagement data');
    const response = await axios.get(`${API_URL}/admin/user-engagement`);
    console.log('Received engagement data:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Error fetching engagement data:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch engagement data');
  }
};

// Refresh dashboard statistics
export const refreshDashboardStats = async () => {
  try {
    console.log('Refreshing dashboard data');
    // Just trigger a refresh by calling the API again
    const response = await axios.get(`${API_URL}/admin/dashboard`);
    return response.data;
  } catch (error) {
    console.error('Error refreshing dashboard:', error);
    throw new Error('Failed to refresh dashboard data');
  }
};
