const { feedback, users, courses, weeks } = require('../models');

// Submit feedback
exports.submitFeedback = async (req, res) => {
  try {
    const userId = req.userId;
    const { courseId, weekId, rating, comment } = req.body;

    const course = await courses.findByPk(courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    const week = await weeks.findByPk(weekId);
    if (!week) return res.status(404).json({ message: 'Week not found' });

    const newFeedback = await feedback.create({
      user_id: userId,
      course_id: courseId,
      week_id: weekId,
      rating,
      comment
    });

    res.status(201).json({
      message: 'Feedback submitted successfully',
      feedback: newFeedback
    });
  } catch (error) {
    console.error('Error submitting feedback:', error);
    res.status(500).json({ message: 'Error submitting feedback', error: error.message });
  }
};

// Get all feedback
exports.getAllFeedback = async (req, res) => {
  try {
    const allFeedback = await feedback.findAll({
      include: [
        { model: users, attributes: ['id', 'name', 'email', 'avatar_url'] },
        { model: courses, attributes: ['id', 'title'] },
        { model: weeks, attributes: ['id', 'title'] }
      ]
    });

    const transformedFeedback = allFeedback.map(item => ({
      id: item.id,
      userId: item.user_id,
      courseId: item.course_id,
      weekId: item.week_id,
      rating: item.rating,
      comment: item.comment,
      createdAt: item.created_at,
      user: item.user ? {
        name: item.user.name,
        email: item.user.email,
        avatar: item.user.avatar_url
      } : null,
      course: item.course ? {
        title: item.course.title
      } : null,
      week: item.week ? {
        title: item.week.title
      } : null
    }));

    res.status(200).json(transformedFeedback);
  } catch (error) {
    console.error('Error fetching feedback:', error);
    res.status(500).json({ message: 'Error fetching feedback', error: error.message });
  }
};

// Get feedback for a course
exports.getFeedbackForCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    const courseFeedback = await feedback.findAll({
      where: { course_id: courseId },
      include: [
        { model: users, attributes: ['id', 'name', 'email', 'avatar_url'] },
        { model: weeks, attributes: ['id', 'title'] }
      ]
    });

    const transformedFeedback = courseFeedback.map(item => ({
      id: item.id,
      userId: item.user_id,
      weekId: item.week_id,
      rating: item.rating,
      comment: item.comment,
      createdAt: item.created_at,
      user: item.user ? {
        name: item.user.name,
        email: item.user.email,
        avatar: item.user.avatar_url
      } : null,
      week: item.week ? {
        title: item.week.title
      } : null
    }));

    res.status(200).json(transformedFeedback);
  } catch (error) {
    console.error('Error fetching course feedback:', error);
    res.status(500).json({ message: 'Error fetching course feedback', error: error.message });
  }
};

// Get feedback for a specific week (❗This was missing before)
exports.getFeedbackForWeek = async (req, res) => {
  try {
    const { weekId } = req.params;

    const weekFeedback = await feedback.findAll({
      where: { week_id: weekId },
      include: [
        { model: users, attributes: ['id', 'name', 'email', 'avatar_url'] },
        { model: courses, attributes: ['id', 'title'] }
      ]
    });

    const transformedFeedback = weekFeedback.map(item => ({
      id: item.id,
      userId: item.user_id,
      courseId: item.course_id,
      rating: item.rating,
      comment: item.comment,
      createdAt: item.created_at,
      user: item.user ? {
        name: item.user.name,
        email: item.user.email,
        avatar: item.user.avatar_url
      } : null,
      course: item.course ? {
        title: item.course.title
      } : null
    }));

    res.status(200).json(transformedFeedback);
  } catch (error) {
    console.error('Error fetching week feedback:', error);
    res.status(500).json({ message: 'Error fetching week feedback', error: error.message });
  }
};
