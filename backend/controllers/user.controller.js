
const { users, enrollments, courses, progress, topics } = require('../models');
const { Sequelize } = require('sequelize');

exports.getCurrentUser = async (req, res) => {
  try {
    const userId = req.userId;
    
    const user = await users.findByPk(userId, {
      attributes: { exclude: ['password'] }
    });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Error fetching user', error: error.message });
  }
};

exports.updateCurrentUser = async (req, res) => {
  try {
    const userId = req.userId;
    const { name, avatar_url } = req.body;
    
    const user = await users.findByPk(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    await user.update({
      name: name || user.name,
      avatar_url: avatar_url || user.avatar_url
    });
    
    const { password, ...userData } = user.toJSON();
    
    res.status(200).json({
      message: 'User updated successfully',
      user: userData
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Error updating user', error: error.message });
  }
};

exports.getEnrolledCourses = async (req, res) => {
  try {
    const userId = req.userId;
    
    const userEnrollments = await enrollments.findAll({
      where: { user_id: userId },
      include: [{
        model: courses,
        attributes: ['id', 'title', 'description', 'instructor', 'thumbnail']
      }]
    });
    
    // Transform data to match frontend expectations
    const enrolledCourses = userEnrollments.map(enrollment => ({
      id: enrollment.course.id,
      title: enrollment.course.title,
      description: enrollment.course.description,
      instructor: enrollment.course.instructor,
      thumbnail: enrollment.course.thumbnail
    }));
    
    res.status(200).json(enrolledCourses);
  } catch (error) {
    console.error('Error fetching enrolled courses:', error);
    res.status(500).json({ message: 'Error fetching enrolled courses', error: error.message });
  }
};

exports.getUserStats = async (req, res) => {
  try {
    const userId = req.userId;
    
    // Get enrolled courses count
    const coursesCount = await enrollments.count({
      where: { user_id: userId }
    });
    
    // Get videos watched count
    const videosWatched = await progress.count({
      where: {
        user_id: userId,
        completed: true
      }
    });
    
    // Get feedback given count
    const feedbackGiven = await progress.count({
      where: { user_id: userId }
    });
    
    // Get total time spent (in hours)
    const timeSpentResult = await progress.sum('time_spent', {
      where: { user_id: userId }
    });
    
    const hoursSpent = Math.round((timeSpentResult || 0) / 60); // Convert minutes to hours
    
    const stats = {
      coursesEnrolled: coursesCount,
      videosWatched,
      feedbackGiven,
      hoursSpent
    };
    
    res.status(200).json(stats);
  } catch (error) {
    console.error('Error fetching user stats:', error);
    res.status(500).json({ message: 'Error fetching user stats', error: error.message });
  }
};
