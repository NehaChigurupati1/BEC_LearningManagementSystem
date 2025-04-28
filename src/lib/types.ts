// Database types (matches Supabase schema)
export interface DBProfile {
  id: string;
  name: string | null;
  email: string | null;
  role: 'student' | 'admin';
  joined_on: string;
  avatar_url: string | null;
}

export interface DBCourse {
  id: string;
  title: string;
  description: string | null;
  instructor: string;
  thumbnail: string | null;
  created_at: string;
}

export interface DBWeek {
  id: string;
  course_id: string;
  title: string;
  order_number: number;
  created_at: string;
}

export interface DBTopic {
  id: string;
  week_id: string;
  title: string;
  video_url: string | null;
  order_number: number;
  created_at: string;
}

export interface DBResource {
  id: string;
  topic_id: string;
  title: string;
  type: 'pdf' | 'notes' | 'slides';
  url: string;
  created_at: string;
}

export interface DBEnrollment {
  id: string;
  user_id: string;
  course_id: string;
  enrolled_at: string;
}

export interface DBProgress {
  id: string;
  user_id: string;
  topic_id: string;
  completed: boolean;
  completed_at: string | null;
  time_spent: number;
}

export interface DBFeedback {
  id: string;
  user_id: string;
  course_id: string;
  week_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
}

// Client-side types (used in the UI)
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'admin';
  joinedOn: string;
  avatar_url: string | null;
  coursesEnrolled: number;
  videosWatched: number;
  feedbackGiven: number;
  hoursSpent: number;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  thumbnail: string;
  weeks: Week[];
}

export interface Week {
  id: string;
  title: string;
  topics: Topic[];
}

export interface Topic {
  id: string;
  title: string;
  videoUrl: string;
  resources: Resource[];
  completed?: boolean;
}

export interface Resource {
  id: string;
  title: string;
  type: 'pdf' | 'notes' | 'slides';
  url: string;
}

export interface Feedback {
  id: string;
  userId: string;
  courseId: string;
  weekId: string;
  rating: number;
  comment: string;
  createdAt: string;
}
