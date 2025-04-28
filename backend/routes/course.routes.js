
const express = require('express');
const router = express.Router();
const courseController = require('../controllers/course.controller');
const { verifyToken, isAdmin } = require('../middleware/auth.middleware');
const { upload } = require('../middleware/upload.middleware');

// Get all courses (public)
router.get('/', courseController.getAllCourses);

// Get course by ID (public)
router.get('/:id', courseController.getCourseById);

// Create new course (admin only)
router.post('/', 
  verifyToken, 
  isAdmin, 
  upload.single('thumbnail'), 
  courseController.createCourse
);

// Update course (admin only)
router.put('/:id', 
  verifyToken, 
  isAdmin, 
  upload.single('thumbnail'), 
  courseController.updateCourse
);

// Delete course (admin only)
router.delete('/:id', verifyToken, isAdmin, courseController.deleteCourse);

// Get course weeks
router.get('/:id/weeks', courseController.getCourseWeeks);

// Add week to course (admin only)
router.post('/:id/weeks', verifyToken, isAdmin, courseController.addWeekToCourse);

// Add topic to week (admin only)
router.post('/weeks/:weekId/topics', 
  verifyToken, 
  isAdmin, 
  upload.single('video'), 
  courseController.addTopicToWeek
);

// Add resource to topic (admin only)
router.post('/topics/:topicId/resources', 
  verifyToken, 
  isAdmin, 
  upload.single('resource'), 
  courseController.addResourceToTopic
);

// Enroll in a course
router.post('/:id/enroll', verifyToken, courseController.enrollInCourse);

// Mark topic as completed
router.post('/topics/:topicId/complete', verifyToken, courseController.markTopicCompleted);

module.exports = router;
