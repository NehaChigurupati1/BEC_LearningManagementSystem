
module.exports = (sequelize, Sequelize) => {
  const Feedback = sequelize.define("feedback", {
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
    week_id: {
      type: Sequelize.UUID,
      allowNull: false
    },
    rating: {
      type: Sequelize.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5
      }
    },
    comment: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    created_at: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW
    }
  });

  return Feedback;
};
