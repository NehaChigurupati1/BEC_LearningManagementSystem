
const { Sequelize } = require('sequelize');
const dbConfig = require('../config/db.config');

const sequelize = new Sequelize(
  dbConfig.DB,
  dbConfig.USER,
  dbConfig.PASSWORD,
  {
    host: dbConfig.HOST,
    port: dbConfig.PORT,
    dialect: dbConfig.dialect,
    pool: {
      max: dbConfig.pool.max,
      min: dbConfig.pool.min,
      acquire: dbConfig.pool.acquire,
      idle: dbConfig.pool.idle
    }
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Import models
db.users = require('./user.model')(sequelize, Sequelize);
db.courses = require('./course.model')(sequelize, Sequelize);
db.weeks = require('./week.model')(sequelize, Sequelize);
db.topics = require('./topic.model')(sequelize, Sequelize);
db.resources = require('./resource.model')(sequelize, Sequelize);
db.enrollments = require('./enrollment.model')(sequelize, Sequelize);
db.progress = require('./progress.model')(sequelize, Sequelize);
db.feedback = require('./feedback.model')(sequelize, Sequelize);

// Define relationships
// Courses <-> Users (many-to-many through enrollments)
db.courses.belongsToMany(db.users, { through: db.enrollments, foreignKey: 'course_id' });
db.users.belongsToMany(db.courses, { through: db.enrollments, foreignKey: 'user_id' });

// Course -> Weeks (one-to-many)
db.courses.hasMany(db.weeks, { foreignKey: 'course_id' });
db.weeks.belongsTo(db.courses, { foreignKey: 'course_id' });

// Week -> Topics (one-to-many)
db.weeks.hasMany(db.topics, { foreignKey: 'week_id' });
db.topics.belongsTo(db.weeks, { foreignKey: 'week_id' });

// Topic -> Resources (one-to-many)
db.topics.hasMany(db.resources, { foreignKey: 'topic_id' });
db.resources.belongsTo(db.topics, { foreignKey: 'topic_id' });

// User -> Progress (one-to-many)
db.users.hasMany(db.progress, { foreignKey: 'user_id' });
db.progress.belongsTo(db.users, { foreignKey: 'user_id' });

// Topic -> Progress (one-to-many)
db.topics.hasMany(db.progress, { foreignKey: 'topic_id' });
db.progress.belongsTo(db.topics, { foreignKey: 'topic_id' });

// User -> Feedback (one-to-many)
db.users.hasMany(db.feedback, { foreignKey: 'user_id' });
db.feedback.belongsTo(db.users, { foreignKey: 'user_id' });

// Course -> Feedback (one-to-many)
db.courses.hasMany(db.feedback, { foreignKey: 'course_id' });
db.feedback.belongsTo(db.courses, { foreignKey: 'course_id' });

// Week -> Feedback (one-to-many)
db.weeks.hasMany(db.feedback, { foreignKey: 'week_id' });
db.feedback.belongsTo(db.weeks, { foreignKey: 'week_id' });

module.exports = db;
