
import { toast } from 'sonner';

const API_URL = 'http://localhost:5000/api';

// Get the auth token from localStorage
const getToken = () => localStorage.getItem('authToken');

// Create headers with authorization token
const createHeaders = (includeAuth = true) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  if (includeAuth) {
    const token = getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }
  
  return headers;
};

// Handle API responses
const handleResponse = async (response: Response) => {
  const data = await response.json();
  
  if (!response.ok) {
    const error = data.message || 'Something went wrong';
    toast.error(error);
    throw new Error(error);
  }
  
  return data;
};

// API methods
export const api = {
  // Auth endpoints
  auth: {
    login: async (email: string, password: string) => {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: createHeaders(false),
        body: JSON.stringify({ email, password }),
      });
      return handleResponse(response);
    },
    
    register: async (email: string, password: string, name: string) => {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: createHeaders(false),
        body: JSON.stringify({ email, password, name }),
      });
      return handleResponse(response);
    },
  },
  
  // User endpoints
  users: {
    getCurrentUser: async () => {
      const response = await fetch(`${API_URL}/users/me`, {
        headers: createHeaders(),
      });
      return handleResponse(response);
    },
    
    updateCurrentUser: async (userData: any) => {
      const response = await fetch(`${API_URL}/users/me`, {
        method: 'PUT',
        headers: createHeaders(),
        body: JSON.stringify(userData),
      });
      return handleResponse(response);
    },
    
    getEnrolledCourses: async () => {
      const response = await fetch(`${API_URL}/users/me/courses`, {
        headers: createHeaders(),
      });
      return handleResponse(response);
    },
    
    getUserStats: async () => {
      const response = await fetch(`${API_URL}/users/me/stats`, {
        headers: createHeaders(),
      });
      return handleResponse(response);
    },
  },
  
  // Course endpoints
  courses: {
    getAllCourses: async () => {
      const response = await fetch(`${API_URL}/courses`, {
        headers: createHeaders(false),
      });
      return handleResponse(response);
    },
    
    getCourseById: async (id: string) => {
      const response = await fetch(`${API_URL}/courses/${id}`, {
        headers: createHeaders(false),
      });
      return handleResponse(response);
    },
    
    createCourse: async (formData: FormData) => {
      const token = getToken();
      const headers: Record<string, string> = {};
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch(`${API_URL}/courses`, {
        method: 'POST',
        headers,
        body: formData,
      });
      return handleResponse(response);
    },
    
    updateCourse: async (id: string, formData: FormData) => {
      const token = getToken();
      const headers: Record<string, string> = {};
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch(`${API_URL}/courses/${id}`, {
        method: 'PUT',
        headers,
        body: formData,
      });
      return handleResponse(response);
    },
    
    deleteCourse: async (id: string) => {
      const response = await fetch(`${API_URL}/courses/${id}`, {
        method: 'DELETE',
        headers: createHeaders(),
      });
      return handleResponse(response);
    },
    
    enrollInCourse: async (id: string) => {
      const response = await fetch(`${API_URL}/courses/${id}/enroll`, {
        method: 'POST',
        headers: createHeaders(),
      });
      return handleResponse(response);
    },
    
    markTopicCompleted: async (topicId: string, timeSpent: number) => {
      const response = await fetch(`${API_URL}/courses/topics/${topicId}/complete`, {
        method: 'POST',
        headers: createHeaders(),
        body: JSON.stringify({ timeSpent }),
      });
      return handleResponse(response);
    },
  },
  
  // Admin endpoints
  admin: {
    getAllUsers: async () => {
      const response = await fetch(`${API_URL}/admin/users`, {
        headers: createHeaders(),
      });
      return handleResponse(response);
    },
    
    createUser: async (userData: any) => {
      const response = await fetch(`${API_URL}/admin/users`, {
        method: 'POST',
        headers: createHeaders(),
        body: JSON.stringify(userData),
      });
      return handleResponse(response);
    },
    
    updateUser: async (id: string, userData: any) => {
      const response = await fetch(`${API_URL}/admin/users/${id}`, {
        method: 'PUT',
        headers: createHeaders(),
        body: JSON.stringify(userData),
      });
      return handleResponse(response);
    },
    
    deleteUser: async (id: string) => {
      const response = await fetch(`${API_URL}/admin/users/${id}`, {
        method: 'DELETE',
        headers: createHeaders(),
      });
      return handleResponse(response);
    },
    
    getSystemOverview: async () => {
      const response = await fetch(`${API_URL}/admin/overview`, {
        headers: createHeaders(),
      });
      return handleResponse(response);
    },
  },
  
  // Feedback endpoints
  feedback: {
    submitFeedback: async (feedbackData: any) => {
      const response = await fetch(`${API_URL}/feedback`, {
        method: 'POST',
        headers: createHeaders(),
        body: JSON.stringify(feedbackData),
      });
      return handleResponse(response);
    },
    
    getAllFeedback: async () => {
      const response = await fetch(`${API_URL}/feedback`, {
        headers: createHeaders(),
      });
      return handleResponse(response);
    },
    
    getFeedbackForCourse: async (courseId: string) => {
      const response = await fetch(`${API_URL}/feedback/course/${courseId}`, {
        headers: createHeaders(),
      });
      return handleResponse(response);
    },
  },
};
