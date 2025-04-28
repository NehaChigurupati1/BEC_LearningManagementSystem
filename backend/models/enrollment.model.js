
module.exports = (sequelize, Sequelize) => {
  const Enrollment = sequelize.define("enrollments", {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true
    },
    user_id: {
      type: Sequelize.UUID,
      allowNull: false
    },
    course_id: {
      type: Sequelize.UUID,
      allowNull: false
    },
    enrolled_at: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW
    }
  });

  // Add the association method for when the model is initialized
  Enrollment.associate = (models) => {
    Enrollment.belongsTo(models.courses, {
      foreignKey: 'course_id',
      as: 'course'
    });
    
    Enrollment.belongsTo(models.users, {
      foreignKey: 'user_id',
      as: 'user'
    });
  };

  return Enrollment;
};
