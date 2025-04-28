
module.exports = (sequelize, Sequelize) => {
  const Course = sequelize.define("courses", {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true
    },
    title: {
      type: Sequelize.STRING,
      allowNull: false
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    instructor: {
      type: Sequelize.STRING,
      allowNull: false
    },
    thumbnail: {
      type: Sequelize.STRING,
      allowNull: true
    },
    created_at: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW
    }
  });

  // Add association method
  Course.associate = (models) => {
    Course.hasMany(models.enrollments, {
      foreignKey: 'course_id',
      as: 'enrollments'
    });
    
    Course.hasMany(models.weeks, {
      foreignKey: 'course_id',
      as: 'weeks'
    });
  };

  return Course;
};
