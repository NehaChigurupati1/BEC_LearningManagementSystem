
# Learning Management System (LMS) - Project Documentation

## Overview

This Learning Management System (LMS) is a full-stack web application designed for educational institutions and online learning platforms. It provides a comprehensive platform for administrators to create courses and students to enroll in them. The system supports video-based learning, resource management, progress tracking, and user feedback.

## Table of Contents
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Authentication](#authentication)
- [User Roles](#user-roles)
- [Database Structure](#database-structure)
- [Components & Pages](#components--pages)
- [APIs & Services](#apis--services)
- [Deployment](#deployment)
- [Future Enhancements](#future-enhancements)

## Tech Stack

### Frontend
- **React**: Library for building user interfaces
- **TypeScript**: For type-safe JavaScript code
- **React Router**: For navigation and routing
- **TanStack Query (React Query)**: For data fetching and caching
- **React Hook Form**: Form handling with validation
- **Zod**: TypeScript-first schema validation
- **Shadcn UI**: Component library with customizable UI components
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Recharts**: For creating charts and analytics visuals
- **Lucide React**: Icon library
- **Sonner**: Toast notifications

### Backend & Infrastructure
- **Supabase**: Backend-as-a-Service (BaaS) platform providing:
  - Authentication
  - PostgreSQL database
  - Row-level security
  - Storage service
  - Serverless functions
- **Vite**: Build tool and development server

## Features

### User Authentication
- **Email/Password Login**: Traditional authentication method
- **Google OAuth**: Social login option
- **Password Recovery**: Forgot password flow
- **Session Management**: Persistent login sessions

### Student Features
- **Course Catalog**: Browse available courses
- **Course Enrollment**: Join courses of interest
- **Video Learning**: Watch course videos with progress tracking
- **Resource Access**: Download course materials (PDFs, notes, slides)
- **Progress Tracking**: Visual indicators of course completion
- **Feedback Submission**: Rate and comment on courses or specific weeks
- **Personal Dashboard**: Overview of enrolled courses and learning progress

### Admin Features
- **Course Management**: Create, update, and delete courses
- **Content Organization**: Structure courses with weeks and topics
- **Resource Management**: Upload and manage learning materials
- **User Management**: View and manage student accounts
- **Analytics Dashboard**: Overview of platform usage and student engagement
- **Feedback Analysis**: Review student feedback and ratings

### Responsive Design
- **Full Responsiveness**: Works on desktop, tablet, and mobile devices
- **Optimized UI**: Different layouts for different screen sizes

## Authentication

The application uses Supabase Authentication with the following features:
- **Email/Password**: Traditional signup and login
- **Google OAuth**: Single-click social authentication
- **Session Persistence**: Remembers user login across browser sessions
- **Role-based Authorization**: Different access for students and admins
- **Demo Accounts**: Pre-configured admin and student accounts for testing

Authentication flow:
1. User signs up or logs in
2. On successful authentication, a user profile is created/fetched
3. The application redirects to the appropriate dashboard based on user role
4. Protected routes ensure authenticated access only

## User Roles

The system has two primary user roles:

### Student
- Default role for new sign-ups
- Can browse courses, enroll, view content, track progress, and provide feedback
- Has access to personal dashboard with learning statistics

### Admin
- Can create and manage all course content
- Has access to user management features
- Can view platform-wide analytics and feedback
- Has additional administrative privileges

## Database Structure

### Tables
- **profiles**: User information and statistics
- **courses**: Course details and metadata
- **weeks**: Course sections organized by week
- **topics**: Individual lessons within weeks
- **resources**: Additional materials for topics
- **enrollments**: Maps users to courses they're enrolled in
- **progress**: Tracks user completion of topics
- **feedback**: Stores user ratings and comments

### Relationships
- **One-to-Many**: 
  - Course → Weeks
  - Week → Topics
  - Topic → Resources
- **Many-to-Many**:
  - Users ↔ Courses (via enrollments table)
  - Users ↔ Topics (via progress table)

## Components & Pages

### Core Pages
- **Home (/)**: Landing page with featured courses and call-to-action
- **Login (/login)**: User authentication
- **Register (/register)**: New user sign-up
- **Courses (/courses)**: Course catalog listing
- **Course Details (/course/:id)**: Detailed view of a specific course
- **Student Dashboard (/dashboard)**: Personal dashboard for students
- **Admin Dashboard (/admin)**: Administrative control center
- **Profile (/profile)**: User profile and settings

### Key Components
- **Layout**: Page structure with header and footer
- **AuthForm**: Login/register form with validation
- **CourseCard**: Reusable course preview component
- **ProtectedRoute**: Route wrapper for authentication checks
- **AdminRoute**: Route wrapper for admin-only access
- **AddCourseForm**: Form for adding new courses

## APIs & Services

### Authentication Services
- **signIn**: Authenticate existing users
- **signUp**: Register new users
- **signInWithGoogle**: OAuth authentication
- **signOut**: End user session
- **getCurrentUser**: Fetch current authenticated user

### Course Services
- **getAllCourses**: Fetch all available courses
- **getCourseById**: Get details for a specific course
- **enrollInCourse**: Enroll a user in a course
- **getEnrolledCourses**: Get courses the current user is enrolled in
- **updateTopicProgress**: Mark topics as completed
- **submitFeedback**: Submit ratings and comments
- **getUserStats**: Get learning statistics for a user

### Admin Services
- **addCourse**: Create a new course
- **updateCourse**: Modify course details
- **deleteCourse**: Remove a course
- **addWeek**: Add a new week to a course
- **addTopic**: Add a new topic to a week
- **addResource**: Add a resource to a topic
- **getAllUsers**: Fetch all user accounts
- **updateUserRole**: Change a user's role
- **getAllFeedback**: View all student feedback

## Deployment

The application is ready for production deployment:

1. **Build Process**: Use `npm run build` to generate optimized production assets
2. **Database Configuration**: Ensure Supabase tables and policies are correctly set up
3. **Authentication Settings**: Configure Supabase authentication providers
4. **Environment Variables**: Set necessary variables for production

## Future Enhancements

Potential improvements for future versions:

- **Live Sessions**: Real-time video lectures and Q&A
- **Discussion Forums**: Course-specific discussion boards
- **Assessment System**: Quizzes and assignments with grading
- **Certificate Generation**: Course completion certificates
- **Subscription Plans**: Different access levels and payment processing
- **Content Analytics**: Detailed insights into learning patterns
- **Mobile Application**: Native mobile experiences

---

This documentation provides a comprehensive overview of the Learning Management System application, its architecture, features, and implementation details. For more specific technical details, please refer to the codebase directly.
