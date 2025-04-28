
module.exports = (sequelize, Sequelize) => {
  const Progress = sequelize.define("progress", {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true
    },
    user_id: {
      type: Sequelize.UUID,
      allowNull: false
    },
    topic_id: {
      type: Sequelize.UUID,
      allowNull: false
    },
    completed: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    },
    completed_at: {
      type: Sequelize.DATE,
      allowNull: true
    },
    time_spent: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
      comment: 'Time spent in minutes'
    }
  });

  return Progress;
};
