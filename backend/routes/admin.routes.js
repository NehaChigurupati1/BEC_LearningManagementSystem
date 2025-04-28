
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { verifyToken, isAdmin } = require('../middleware/auth.middleware');
const { upload } = require('../middleware/upload.middleware')
// Get all users (admin only)
router.get('/users', verifyToken, isAdmin, adminController.getAllUsers);

// Add a new user (admin only)
router.post('/users', verifyToken, isAdmin, adminController.createUser);

// Update a user (admin only)
router.put('/users/:id', verifyToken, isAdmin, adminController.updateUser);

// Delete a user (admin only)
router.delete('/users/:id', verifyToken, isAdmin, adminController.deleteUser);

// Get system overview data (admin only)
router.get('/overview', verifyToken, isAdmin, adminController.getSystemOverview);

// Get dashboard data (admin only)
router.get('/dashboard', verifyToken, isAdmin, adminController.getDashboardStats);

// User engagement data (admin only)
router.get('/user-engagement', verifyToken, isAdmin, adminController.getUserEngagement);

// Create course (admin only)
router.post('/courses', verifyToken, isAdmin, upload.single('thumbnail'),adminController.createAdminCourse);

// Update role for a user (admin only)
router.patch('/users/:id/role', verifyToken, isAdmin, adminController.updateUserRole);

// Get all feedback (admin only) - Fixed route to use admin prefix
router.get('/feedback', verifyToken, isAdmin, (req, res, next) => {
  const feedbackRoutes = require('./feedback.routes').handle;
  feedbackRoutes(req, res, next);
});

module.exports = router;
