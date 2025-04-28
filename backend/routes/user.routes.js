
const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { verifyToken } = require('../middleware/auth.middleware');

// Get current user profile
router.get('/me', verifyToken, userController.getCurrentUser);

// Update current user profile
router.put('/me', verifyToken, userController.updateCurrentUser);

// Get enrolled courses for current user
router.get('/me/courses', verifyToken, userController.getEnrolledCourses);

// Get user stats (videos watched, hours spent, etc.)
router.get('/me/stats', verifyToken, userController.getUserStats);

module.exports = router;
