
module.exports = (sequelize, Sequelize) => {
  const Topic = sequelize.define("topics", {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true
    },
    week_id: {
      type: Sequelize.UUID,
      allowNull: false
    },
    title: {
      type: Sequelize.STRING,
      allowNull: false
    },
    video_url: {
      type: Sequelize.STRING,
      allowNull: true
    },
    order_number: {
      type: Sequelize.INTEGER,
      allowNull: false
    }
  });

  return Topic;
};
