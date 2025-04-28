
import { Course, User } from './types';

export const mockCourses: Course[] = [
  {
    id: '1',
    title: 'Introduction to Computer Science',
    description: 'A comprehensive introduction to computer science principles, algorithms, and programming fundamentals.',
    instructor: 'Dr. Alan Turing',
    thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=2070&auto=format&fit=crop',
    weeks: [
      {
        id: 'w1',
        title: 'Week 1: Introduction to Programming',
        topics: [
          {
            id: 't1',
            title: 'Understanding Algorithms',
            videoUrl: 'https://example.com/video1',
            resources: [
              {
                id: 'r1',
                title: 'Algorithm Basics PDF',
                type: 'pdf',
                url: 'https://example.com/pdf1'
              },
              {
                id: 'r2',
                title: 'Lecture Notes',
                type: 'notes',
                url: 'https://example.com/notes1'
              }
            ]
          },
          {
            id: 't2',
            title: 'Getting Started with Python',
            videoUrl: 'https://example.com/video2',
            resources: [
              {
                id: 'r3',
                title: 'Python Installation Guide',
                type: 'pdf',
                url: 'https://example.com/pdf2'
              }
            ]
          }
        ]
      },
      {
        id: 'w2',
        title: 'Week 2: Data Structures',
        topics: [
          {
            id: 't3',
            title: 'Arrays and Lists',
            videoUrl: 'https://example.com/video3',
            resources: [
              {
                id: 'r4',
                title: 'Data Structures Overview',
                type: 'slides',
                url: 'https://example.com/slides1'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: '2',
    title: 'Advanced Machine Learning',
    description: 'Deep dive into neural networks, deep learning frameworks, and practical applications in industry.',
    instructor: 'Dr. Grace Hopper',
    thumbnail: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?q=80&w=2070&auto=format&fit=crop',
    weeks: [
      {
        id: 'w3',
        title: 'Week 1: Neural Network Basics',
        topics: [
          {
            id: 't4',
            title: 'Introduction to Neural Networks',
            videoUrl: 'https://example.com/video4',
            resources: [
              {
                id: 'r5',
                title: 'Neural Networks Explained',
                type: 'pdf',
                url: 'https://example.com/pdf3'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: '3',
    title: 'Web Development Fundamentals',
    description: 'Learn HTML, CSS, and JavaScript to build responsive and interactive websites from scratch.',
    instructor: 'Prof. Tim Berners-Lee',
    thumbnail: 'https://images.unsplash.com/photo-1547658719-da2b51169166?q=80&w=2064&auto=format&fit=crop',
    weeks: [
      {
        id: 'w4',
        title: 'Week 1: HTML Basics',
        topics: [
          {
            id: 't5',
            title: 'HTML Document Structure',
            videoUrl: 'https://example.com/video5',
            resources: [
              {
                id: 'r6',
                title: 'HTML Cheat Sheet',
                type: 'pdf',
                url: 'https://example.com/pdf4'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: '4',
    title: 'Data Science and Analytics',
    description: 'Master data analysis techniques, statistical methods, and data visualization tools for actionable insights.',
    instructor: 'Dr. Ada Lovelace',
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop',
    weeks: [
      {
        id: 'w5',
        title: 'Week 1: Introduction to Data Analysis',
        topics: [
          {
            id: 't6',
            title: 'Statistical Foundations',
            videoUrl: 'https://example.com/video6',
            resources: [
              {
                id: 'r7',
                title: 'Statistics Primer',
                type: 'pdf',
                url: 'https://example.com/pdf5'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: '5',
    title: 'iOS App Development',
    description: 'Build iOS applications using Swift, UIKit, and the latest Apple development frameworks.',
    instructor: 'Prof. Steve Wozniak',
    thumbnail: 'https://images.unsplash.com/photo-1621839673705-6617adf9e890?q=80&w=2032&auto=format&fit=crop',
    weeks: [
      {
        id: 'w6',
        title: 'Week 1: Swift Programming',
        topics: [
          {
            id: 't7',
            title: 'Swift Syntax Fundamentals',
            videoUrl: 'https://example.com/video7',
            resources: [
              {
                id: 'r8',
                title: 'Swift Language Guide',
                type: 'pdf',
                url: 'https://example.com/pdf6'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: '6',
    title: 'Blockchain Technology',
    description: 'Understand the principles of blockchain, cryptocurrencies, and decentralized applications.',
    instructor: 'Dr. Satoshi Nakamoto',
    thumbnail: 'https://images.unsplash.com/photo-1639762681057-408e52192e55?q=80&w=2070&auto=format&fit=crop',
    weeks: [
      {
        id: 'w7',
        title: 'Week 1: Blockchain Fundamentals',
        topics: [
          {
            id: 't8',
            title: 'Distributed Ledger Technology',
            videoUrl: 'https://example.com/video8',
            resources: [
              {
                id: 'r9',
                title: 'Blockchain Explained',
                type: 'pdf',
                url: 'https://example.com/pdf7'
              }
            ]
          }
        ]
      }
    ]
  }
];

export const mockUsers: User[] = [
  {
    id: 'user-1',
    email: 'student@example.com',
    name: 'Jane Doe',
    role: 'student',
    joinedOn: '2023-04-15T10:30:00Z',
    avatar_url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9',
    coursesEnrolled: 3,
    videosWatched: 15,
    feedbackGiven: 2,
    hoursSpent: 8
  },
  {
    id: 'user-2',
    email: 'admin@example.com',
    name: 'John Smith',
    role: 'admin',
    joinedOn: '2023-01-10T08:15:00Z',
    avatar_url: null,
    coursesEnrolled: 0,
    videosWatched: 0,
    feedbackGiven: 0,
    hoursSpent: 0
  }
];

export const mockUser: User = {
  id: '1',
  email: 'student@example.com',
  name: 'John Doe',
  role: 'student',
  joinedOn: '2023-01-15',
  avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=1760&auto=format&fit=crop',
  coursesEnrolled: 3,
  videosWatched: 27,
  feedbackGiven: 5,
  hoursSpent: 12
};

export const mockAdmin: User = {
  id: '2',
  email: 'admin@example.com',
  name: 'Admin User',
  role: 'admin',
  joinedOn: '2022-11-10',
  avatar_url: null,
  coursesEnrolled: 0,
  videosWatched: 0,
  feedbackGiven: 0,
  hoursSpent: 0
};
