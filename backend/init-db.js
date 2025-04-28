
require('dotenv').config();
const { Sequelize } = require('sequelize');
const bcrypt = require('bcrypt');
const dbConfig = require('./config/db.config');

const sequelize = new Sequelize(
  dbConfig.DB,
  dbConfig.USER,
  dbConfig.PASSWORD,
  {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    port: dbConfig.PORT
  }
);

const initializeDatabase = async () => {
  try {
    // Create database if it doesn't exist
    await sequelize.query(`CREATE DATABASE IF NOT EXISTS ${dbConfig.DB};`);
    console.log(`Database ${dbConfig.DB} created or already exists`);

    // Re-establish connection to the new database
    const db = require('./models');
    await db.sequelize.sync({ force: true });
    console.log('Database tables created successfully');

    // Create admin user
    const hashedPassword = await bcrypt.hash('becadmin@987', 10);
    const adminUser = await db.users.create({
      name: 'Admin User',
      email: 'becadmin@gmail.com',
      password: hashedPassword,
      role: 'admin',
      joined_on: new Date()
    });
    console.log('Admin user created successfully:', adminUser.email);

    // Create sample student user
    const studentPassword = await bcrypt.hash('student123', 10);
    const studentUser = await db.users.create({
      name: 'Student User',
      email: 'student@example.com',
      password: studentPassword,
      role: 'student',
      joined_on: new Date()
    });
    console.log('Student user created successfully:', studentUser.email);

    // Create sample course
    const course = await db.courses.create({
      title: 'Introduction to Web Development',
      description: 'Learn the fundamentals of web development including HTML, CSS, and JavaScript.',
      instructor: 'John Doe',
      thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop'
    });
    console.log('Sample course created successfully');

    // Create sample week
    const week = await db.weeks.create({
      course_id: course.id,
      title: 'Week 1: HTML Basics',
      order_number: 1
    });
    console.log('Sample week created successfully');

    // Create sample topic
    const topic = await db.topics.create({
      week_id: week.id,
      title: 'Introduction to HTML',
      video_url: 'https://example.com/sample-video.mp4',
      order_number: 1
    });
    console.log('Sample topic created successfully');

    // Create sample resource
    await db.resources.create({
      topic_id: topic.id,
      title: 'HTML Cheatsheet',
      type: 'pdf',
      url: 'https://example.com/html-cheatsheet.pdf'
    });
    console.log('Sample resource created successfully');

    // Create sample enrollment
    await db.enrollments.create({
      user_id: studentUser.id,
      course_id: course.id
    });
    console.log('Sample enrollment created successfully');

    // Create sample progress
    await db.progress.create({
      user_id: studentUser.id,
      topic_id: topic.id,
      completed: true,
      completed_at: new Date(),
      time_spent: 60 // minutes
    });
    console.log('Sample progress created successfully');

    // Create sample feedback
    await db.feedback.create({
      user_id: studentUser.id,
      course_id: course.id,
      week_id: week.id,
      rating: 5,
      comment: 'Excellent course material!'
    });
    console.log('Sample feedback created successfully');

    console.log('Database initialization completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Database initialization failed:', error);
    process.exit(1);
  }
};

initializeDatabase();
