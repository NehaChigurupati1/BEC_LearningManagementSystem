
const { courses, weeks, topics, resources, enrollments, progress, users } = require('../models');
const { uploadToFirebase } = require('../middleware/upload.middleware');
const { Sequelize, Op } = require('sequelize');

exports.getAllCourses = async (req, res) => {
  try {
    const allCourses = await courses.findAll({
      attributes: ['id', 'title', 'description', 'instructor', 'thumbnail', 'created_at']
    });
    
    res.status(200).json(allCourses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ message: 'Error fetching courses', error: error.message });
  }
};

exports.getCourseById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const course = await courses.findByPk(id, {
      include: [
        { 
          model: weeks,
          include: [{
            model: topics,
            include: [resources]
          }]
        }
      ]
    });
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    // Transform the data to match frontend expectations
    const transformedCourse = {
      id: course.id,
      title: course.title,
      description: course.description,
      instructor: course.instructor,
      thumbnail: course.thumbnail,
      weeks: course.weeks.map(week => ({
        id: week.id,
        title: week.title,
        topics: week.topics.map(topic => ({
          id: topic.id,
          title: topic.title,
          videoUrl: topic.video_url,
          resources: topic.resources.map(resource => ({
            id: resource.id,
            title: resource.title,
            type: resource.type,
            url: resource.url
          }))
        }))
      }))
    };
    
    res.status(200).json(transformedCourse);
  } catch (error) {
    console.error('Error fetching course:', error);
    res.status(500).json({ message: 'Error fetching course', error: error.message });
  }
};

exports.createCourse = async (req, res) => {
  try {
    const { title, description, instructor } = req.body;
    
    let thumbnailUrl = null;
    if (req.file) {
      thumbnailUrl = await uploadToFirebase(req.file, 'thumbnails');
    }
    
    const newCourse = await courses.create({
      title,
      description,
      instructor,
      thumbnail: thumbnailUrl
    });
    
    res.status(201).json({
      message: 'Course created successfully',
      course: newCourse
    });
  } catch (error) {
    console.error('Error creating course:', error);
    res.status(500).json({ message: 'Error creating course', error: error.message });
  }
};

exports.updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, instructor } = req.body;
    
    const course = await courses.findByPk(id);
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    let thumbnailUrl = course.thumbnail;
    if (req.file) {
      thumbnailUrl = await uploadToFirebase(req.file, 'thumbnails');
    }
    
    await course.update({
      title: title || course.title,
      description: description || course.description,
      instructor: instructor || course.instructor,
      thumbnail: thumbnailUrl
    });
    
    res.status(200).json({
      message: 'Course updated successfully',
      course
    });
  } catch (error) {
    console.error('Error updating course:', error);
    res.status(500).json({ message: 'Error updating course', error: error.message });
  }
};

exports.deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;
    
    const course = await courses.findByPk(id);
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    await course.destroy();
    
    res.status(200).json({ message: 'Course deleted successfully' });
  } catch (error) {
    console.error('Error deleting course:', error);
    res.status(500).json({ message: 'Error deleting course', error: error.message });
  }
};

exports.getCourseWeeks = async (req, res) => {
  try {
    const { id } = req.params;
    
    const courseWeeks = await weeks.findAll({
      where: { course_id: id },
      order: [['order_number', 'ASC']],
      include: [{
        model: topics,
        order: [['order_number', 'ASC']],
        include: [resources]
      }]
    });
    
    res.status(200).json(courseWeeks);
  } catch (error) {
    console.error('Error fetching course weeks:', error);
    res.status(500).json({ message: 'Error fetching course weeks', error: error.message });
  }
};

exports.addWeekToCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, orderNumber } = req.body;
    
    // Check if course exists
    const course = await courses.findByPk(id);
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    const newWeek = await weeks.create({
      course_id: id,
      title,
      order_number: orderNumber
    });
    
    res.status(201).json({
      message: 'Week added to course successfully',
      week: newWeek
    });
  } catch (error) {
    console.error('Error adding week to course:', error);
    res.status(500).json({ message: 'Error adding week to course', error: error.message });
  }
};

exports.addTopicToWeek = async (req, res) => {
  try {
    const { weekId } = req.params;
    const { title, orderNumber } = req.body;
    
    // Check if week exists
    const week = await weeks.findByPk(weekId);
    
    if (!week) {
      return res.status(404).json({ message: 'Week not found' });
    }
    
    let videoUrl = null;
    if (req.file) {
      videoUrl = await uploadToFirebase(req.file, 'videos');
    }
    
    const newTopic = await topics.create({
      week_id: weekId,
      title,
      video_url: videoUrl,
      order_number: orderNumber
    });
    
    res.status(201).json({
      message: 'Topic added to week successfully',
      topic: newTopic
    });
  } catch (error) {
    console.error('Error adding topic to week:', error);
    res.status(500).json({ message: 'Error adding topic to week', error: error.message });
  }
};

exports.addResourceToTopic = async (req, res) => {
  try {
    const { topicId } = req.params;
    const { title, type } = req.body;
    
    // Check if topic exists
    const topic = await topics.findByPk(topicId);
    
    if (!topic) {
      return res.status(404).json({ message: 'Topic not found' });
    }
    
    if (!req.file) {
      return res.status(400).json({ message: 'Resource file is required' });
    }
    
    const resourceUrl = await uploadToFirebase(req.file, 'resources');
    
    const newResource = await resources.create({
      topic_id: topicId,
      title,
      type,
      url: resourceUrl
    });
    
    res.status(201).json({
      message: 'Resource added to topic successfully',
      resource: newResource
    });
  } catch (error) {
    console.error('Error adding resource to topic:', error);
    res.status(500).json({ message: 'Error adding resource to topic', error: error.message });
  }
};

exports.enrollInCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    
    // Check if course exists
    const course = await courses.findByPk(id);
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    // Check if already enrolled
    const existingEnrollment = await enrollments.findOne({
      where: {
        user_id: userId,
        course_id: id
      }
    });
    
    if (existingEnrollment) {
      return res.status(409).json({ message: 'Already enrolled in this course' });
    }
    
    const newEnrollment = await enrollments.create({
      user_id: userId,
      course_id: id
    });
    
    res.status(201).json({
      message: 'Enrolled in course successfully',
      enrollment: newEnrollment
    });
  } catch (error) {
    console.error('Error enrolling in course:', error);
    res.status(500).json({ message: 'Error enrolling in course', error: error.message });
  }
};

exports.markTopicCompleted = async (req, res) => {
  try {
    const { topicId } = req.params;
    const { timeSpent = 0 } = req.body;
    const userId = req.userId;
    
    // Check if topic exists
    const topic = await topics.findByPk(topicId);
    
    if (!topic) {
      return res.status(404).json({ message: 'Topic not found' });
    }
    
    // Check if progress already exists
    const existingProgress = await progress.findOne({
      where: {
        user_id: userId,
        topic_id: topicId
      }
    });
    
    if (existingProgress) {
      await existingProgress.update({
        completed: true,
        completed_at: new Date(),
        time_spent: existingProgress.time_spent + timeSpent
      });
    } else {
      await progress.create({
        user_id: userId,
        topic_id: topicId,
        completed: true,
        completed_at: new Date(),
        time_spent: timeSpent
      });
    }
    
    res.status(200).json({ message: 'Topic marked as completed' });
  } catch (error) {
    console.error('Error marking topic as completed:', error);
    res.status(500).json({ message: 'Error marking topic as completed', error: error.message });
  }
};
