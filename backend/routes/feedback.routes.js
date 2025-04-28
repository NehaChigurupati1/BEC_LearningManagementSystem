const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedback.controller');
const { verifyToken, isAdmin } = require('../middleware/auth.middleware');

// Submit feedback for a course/week
router.post('/', verifyToken, feedbackController.submitFeedback);

// Get all feedback (admin only)
router.get('/', verifyToken, isAdmin, feedbackController.getAllFeedback);

// Get feedback for a course
router.get('/course/:courseId', verifyToken, feedbackController.getFeedbackForCourse);

// Get feedback for a specific week
router.get('/week/:weekId', verifyToken, feedbackController.getFeedbackForWeek);

module.exports = router;
