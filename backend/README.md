
# LMS Backend

This is the backend for the Learning Management System (LMS) project.

## Setup Instructions

### Prerequisites
- Node.js (v14+)
- MySQL (v8+)
- Firebase account with Storage enabled

### Environment Setup

1. Clone the repository
2. Navigate to the `backend` directory
3. Install dependencies:
```
npm install
```

4. Create a `.env` file in the backend directory with the following variables:
```
PORT=5000
DB_HOST=localhost
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_NAME=lms_system
DB_PORT=3306
JWT_SECRET=your_secret_key
JWT_EXPIRY=7d
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_PRIVATE_KEY="your-firebase-private-key"
FIREBASE_CLIENT_EMAIL=your-firebase-client-email
FIREBASE_STORAGE_BUCKET=your-firebase-storage-bucket
```

### Firebase Setup

1. Create a Firebase project at [https://console.firebase.google.com/](https://console.firebase.google.com/)
2. Enable Firebase Storage
3. Go to Project Settings > Service Accounts
4. Generate a new private key (this will download a JSON file)
5. Use the values from the JSON file to populate your `.env` file:
   - `FIREBASE_PROJECT_ID`: `project_id` from the JSON
   - `FIREBASE_PRIVATE_KEY`: `private_key` from the JSON (keep the quotes)
   - `FIREBASE_CLIENT_EMAIL`: `client_email` from the JSON
   - `FIREBASE_STORAGE_BUCKET`: `<your-project-id>.appspot.com`

### Database Setup

1. Make sure MySQL is running
2. Run the initialization script to create the database and tables:
```
node init-db.js
```

This will:
- Create the `lms_system` database (if it doesn't exist)
- Create all required tables
- Add sample data including:
  - Admin user (email: becadmin@gmail.com, password: becadmin@987)
  - Student user (email: student@example.com, password: student123)
  - Sample course, week, topic, resource, enrollment, progress, and feedback

### Starting the Server

Run the development server:
```
npm run dev
```

Or for production:
```
npm start
```

The server will start on port 5000 (or the port specified in your .env file).

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Courses
- `GET /api/courses` - Get all courses
- `GET /api/courses/:id` - Get course by ID
- `POST /api/courses` - Create new course (admin only)
- `PUT /api/courses/:id` - Update course (admin only)
- `DELETE /api/courses/:id` - Delete course (admin only)
- `GET /api/courses/:id/weeks` - Get course weeks
- `POST /api/courses/:id/weeks` - Add week to course (admin only)
- `POST /api/courses/weeks/:weekId/topics` - Add topic to week (admin only)
- `POST /api/courses/topics/:topicId/resources` - Add resource to topic (admin only)
- `POST /api/courses/:id/enroll` - Enroll in a course
- `POST /api/courses/topics/:topicId/complete` - Mark topic as completed

### Users
- `GET /api/users/me` - Get current user profile
- `PUT /api/users/me` - Update current user profile
- `GET /api/users/me/courses` - Get enrolled courses for current user
- `GET /api/users/me/stats` - Get user stats

### Admin
- `GET /api/admin/users` - Get all users (admin only)
- `POST /api/admin/users` - Add a new user (admin only)
- `PUT /api/admin/users/:id` - Update a user (admin only)
- `DELETE /api/admin/users/:id` - Delete a user (admin only)
- `GET /api/admin/overview` - Get system overview data (admin only)

### Feedback
- `POST /api/feedback` - Submit feedback for a course
- `GET /api/feedback` - Get all feedback (admin only)
- `GET /api/feedback/course/:courseId` - Get feedback for a specific course

## Front-end Integration

To connect this backend to the React front-end:

1. Make sure the backend is running
2. Update the front-end API service files to use the new endpoints
3. Make sure the authentication token is properly stored and sent with requests
4. Update environment variables in the front-end to point to this backend
