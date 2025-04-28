
const { users, courses, enrollments, feedback, progress, topics, weeks } = require('../models');
const bcrypt = require('bcrypt');
const { uploadToFirebase } = require('../middleware/upload.middleware');
const { Sequelize, Op } = require('sequelize');

exports.getAllUsers = async (req, res) => {
  try {
    const allUsers = await users.findAll({
      attributes: { exclude: ['password'] }
    });
    
    res.status(200).json(allUsers);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
};

exports.createUser = async (req, res) => {
  try {
    const { name, email, password, role = 'student' } = req.body;
    
    // Check if email already exists
    const existingUser = await users.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already in use' });
    }
    
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create the user
    const user = await users.create({
      name,
      email,
      password: hashedPassword,
      role,
      joined_on: new Date()
    });
    
    // Return user data without password
    const { password: _, ...userData } = user.toJSON();
    
    res.status(201).json({
      message: 'User created successfully',
      user: userData
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Error creating user', error: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role, avatar_url } = req.body;
    
    const user = await users.findByPk(id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    await user.update({
      name: name || user.name,
      email: email || user.email,
      role: role || user.role,
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

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    const user = await users.findByPk(id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    await user.destroy();
    
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Error deleting user', error: error.message });
  }
};

exports.getSystemOverview = async (req, res) => {
  try {
    // Get total students count
    const totalStudents = await users.count({
      where: { role: 'student' }
    });
    
    // Get total courses count
    const totalCourses = await courses.count();
    
    // Get total enrollments count
    const totalEnrollments = await enrollments.count();
    
    // Get total completed topics
    const totalCompletedTopics = await progress.count({
      where: { completed: true }
    });
    
    // Get total feedback count
    const totalFeedback = await feedback.count();
    
    const overview = {
      totalStudents,
      totalCourses,
      totalEnrollments,
      totalCompletedTopics,
      totalFeedback
    };
    
    res.status(200).json(overview);
  } catch (error) {
    console.error('Error fetching system overview:', error);
    res.status(500).json({ message: 'Error fetching system overview', error: error.message });
  }
};

// New function to handle dashboard stats
exports.getDashboardStats = async (req, res) => {
  try {
    // Get total students count
    const activeStudents = await users.count({
      where: { role: 'student' }
    });
    
    // Get total courses count
    const totalCourses = await courses.count();
    
    // Get new courses this month
    const newCoursesThisMonth = await courses.count({
      where: {
        created_at: {
          [Op.gte]: new Date(new Date().setDate(1)) // First day of current month
        }
      }
    });
    
    // Get new enrollments today
    const newEnrollmentsToday = await enrollments.count({
      where: {
        enrolled_at: {
          [Op.gte]: new Date(new Date().setHours(0, 0, 0, 0)) // Start of today
        }
      }
    });
    
    // Get average rating
    const ratings = await feedback.findAll({
      attributes: [
        [Sequelize.fn('AVG', Sequelize.col('rating')), 'averageRating'],
        [Sequelize.fn('COUNT', Sequelize.col('id')), 'count']
      ]
    });
    
    const averageRating = ratings[0].dataValues.averageRating || 0;
    const reviewCount = ratings[0].dataValues.count || 0;
    
    // Get top courses
    const topCourses = await enrollments.findAll({
      attributes: [
        'course_id',
        [Sequelize.fn('COUNT', Sequelize.col('user_id')), 'students']
      ],
      include: [
        {
          model: courses,
          attributes: ['title'],
          as: 'course' // Add this alias to match the association
        }
      ],
      group: ['course_id', 'course.id'],
      order: [[Sequelize.fn('COUNT', Sequelize.col('user_id')), 'DESC']],
      limit: 5
    });
    
    const formattedTopCourses = topCourses.map(course => ({
      id: course.course_id,
      title: course.course ? course.course.title : 'Unknown Course',
      students: parseInt(course.dataValues.students, 10)
    }));
    
    res.status(200).json({
      totalCourses,
      activeStudents,
      averageRating: parseFloat(averageRating).toFixed(1),
      newCoursesThisMonth,
      newEnrollmentsToday,
      reviewCount,
      topCourses: formattedTopCourses
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ message: 'Error fetching dashboard stats', error: error.message });
  }
};

// User engagement data for charts
exports.getUserEngagement = async (req, res) => {
  try {
    // Generate data for the last 30 days with 5-day intervals
    const engagementData = [];
    const today = new Date();
    
    for (let i = 30; i >= 0; i -= 5) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      
      // Count progress records for this date
      const completions = await progress.count({
        where: {
          completed_at: {
            [Op.gte]: new Date(date.setHours(0, 0, 0, 0)),
            [Op.lt]: new Date(date.setHours(23, 59, 59, 999))
          }
        }
      });
      
      // Count enrollments for this date
      const enrollmentCount = await enrollments.count({
        where: {
          enrolled_at: {
            [Op.gte]: new Date(new Date(date).setHours(0, 0, 0, 0)),
            [Op.lt]: new Date(new Date(date).setHours(23, 59, 59, 999))
          }
        }
      });
      
      engagementData.push({
        date: new Date(date).toISOString().split('T')[0],
        count: completions,
        enrollments: enrollmentCount
      });
    }
    
    res.status(200).json(engagementData);
  } catch (error) {
    console.error('Error fetching user engagement data:', error);
    res.status(500).json({ message: 'Error fetching user engagement data', error: error.message });
  }
};

// Create course from admin panel
exports.createAdminCourse = async (req, res) => {
  try {
    console.log('Received course creation request:', req.body);
    const { title, description, instructor, thumbnailUrl } = req.body;
    
    if (!title || !description || !instructor) {
      return res.status(400).json({ message: 'Missing required fields: title, description, or instructor' });
    }
    
    let thumbnail = thumbnailUrl;
    // If there's a file upload, process it
    if (req.file) {
      console.log('Processing file upload for thumbnail');
      thumbnail = await uploadToFirebase(req.file, 'thumbnails');
    }
    
    console.log('Creating new course with data:', { title, description, instructor, thumbnail });
    
    const newCourse = await courses.create({
      title,
      description,
      instructor,
      thumbnail
    });

    console.log('Course created successfully:', newCourse.id);

    // Create a default week for the course
    const defaultWeek = await weeks.create({
      course_id: newCourse.id,
      title: "Week 1: Introduction",
      order_number: 1
    });

    // Create a default topic for the week
    await topics.create({
      week_id: defaultWeek.id,
      title: "Getting Started",
      order_number: 1,
      video_url: null
    });
    
    res.status(201).json({
      message: 'Course created successfully',
      course: {
        ...newCourse.toJSON(),
        weeks: [{ 
          id: defaultWeek.id, 
          title: defaultWeek.title,
          topics: []
        }]
      }
    });
  } catch (error) {
    console.error('Error creating course:', error);
    res.status(500).json({ message: 'Error creating course', error: error.message });
  }
};

// Update user role
exports.updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    
    if (!['admin', 'student'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }
    
    const user = await users.findByPk(id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    await user.update({ role });
    
    res.status(200).json({ message: 'User role updated successfully' });
  } catch (error) {
    console.error('Error updating user role:', error);
    res.status(500).json({ message: 'Error updating user role', error: error.message });
  }
};
