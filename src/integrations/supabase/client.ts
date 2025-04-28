// This is a mock client that is no longer used.
// We've moved to a custom backend running on port 5000.

import axios from 'axios';
import { toast } from 'sonner';

const API_URL = 'http://localhost:5000/api';

// Mock functions to replace Supabase functionalities
export const supabase = {
  auth: {
    signOut: async () => {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      return { error: null };
    },
    admin: {
      createUser: async (userData: any) => {
        try {
          const response = await axios.post(`${API_URL}/admin/users`, userData);
          return { data: response.data, error: null };
        } catch (error: any) {
          return { data: null, error: error.response?.data || { message: 'Failed to create user' } };
        }
      },
      deleteUser: async (userId: string) => {
        try {
          await axios.delete(`${API_URL}/admin/users/${userId}`);
          return { error: null };
        } catch (error: any) {
          return { error: error.response?.data || { message: 'Failed to delete user' } };
        }
      }
    }
  },
  from: (table: string) => {
    return {
      select: (columns: string) => {
        return {
          order: (column: string, { ascending }: { ascending: boolean }) => {
            return {
              gte: (column: string, value: any) => {
                return mockDataFetch(table, columns, column, ascending, value);
              },
              eq: (column: string, value: any) => {
                return mockDataFetch(table, columns, column, ascending, null, value);
              }
            };
          },
          eq: (column: string, value: any) => {
            return mockDataFetch(table, columns, column, true, null, value);
          }
        };
      },
      upsert: async (data: any) => {
        try {
          const endpoint = getEndpointForTable(table);
          if (!endpoint) return { error: { message: `No endpoint for table ${table}` } };
          
          const response = await axios.post(endpoint, data);
          return { data: response.data, error: null };
        } catch (error: any) {
          return { data: null, error: error.response?.data || { message: `Failed to upsert to ${table}` } };
        }
      },
      delete: () => {
        return {
          eq: async (column: string, value: any) => {
            try {
              const endpoint = getEndpointForTable(table);
              if (!endpoint) return { error: { message: `No endpoint for table ${table}` } };
              
              await axios.delete(`${endpoint}/${value}`);
              return { error: null };
            } catch (error: any) {
              return { error: error.response?.data || { message: `Failed to delete from ${table}` } };
            }
          }
        };
      }
    };
  },
  channel: (channelName: string) => {
    return {
      on: (event: string, table: any, callback: Function) => {
        console.log(`Mock channel ${channelName} listening for ${event} on ${table.table}`);
        // Return the channel object for chaining
        return {
          subscribe: () => {
            console.log(`Subscribed to mock channel ${channelName}`);
            return {};
          }
        };
      }
    };
  },
  removeChannel: (channel: any) => {
    console.log('Mock channel removed');
  }
};

// Helper functions for mock client
const mockDataFetch = async (
  table: string, 
  columns: string, 
  orderColumn: string, 
  ascending: boolean,
  gteValue: any = null,
  eqValue: any = null
) => {
  try {
    const endpoint = getEndpointForTable(table);
    if (!endpoint) return { data: [], error: { message: `No endpoint for table ${table}` } };
    
    const response = await axios.get(endpoint);
    
    // Apply filtering if needed
    let data = response.data;
    
    if (gteValue !== null) {
      data = data.filter((item: any) => {
        const itemDate = new Date(item[orderColumn]);
        const compareDate = new Date(gteValue);
        return itemDate >= compareDate;
      });
    }
    
    if (eqValue !== null) {
      data = data.filter((item: any) => item[orderColumn] === eqValue);
    }
    
    // Sort the data
    data.sort((a: any, b: any) => {
      if (ascending) {
        return a[orderColumn] > b[orderColumn] ? 1 : -1;
      } else {
        return a[orderColumn] < b[orderColumn] ? 1 : -1;
      }
    });
    
    return { data, error: null };
  } catch (error: any) {
    console.error(`Error fetching from ${table}:`, error);
    return { data: [], error: error.response?.data || { message: `Failed to fetch from ${table}` } };
  }
};

const getEndpointForTable = (table: string): string | null => {
  switch (table) {
    case 'profiles':
      return `${API_URL}/admin/users`;
    case 'courses':
      return `${API_URL}/admin/courses`;
    case 'feedback':
      return `${API_URL}/admin/feedback`;
    default:
      console.error(`No API endpoint defined for table ${table}`);
      return null;
  }
};

// Mock functions for stats
export const getDashboardStats = async () => {
  try {
    const response = await axios.get(`${API_URL}/admin/dashboard`);
    return response.data;
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return {
      totalCourses: 0,
      activeStudents: 0,
      averageRating: 0,
      newCoursesThisMonth: 0,
      newEnrollmentsToday: 0,
      reviewCount: 0,
      topCourses: []
    };
  }
};
