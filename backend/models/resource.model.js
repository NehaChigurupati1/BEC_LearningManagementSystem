
module.exports = (sequelize, Sequelize) => {
  const Resource = sequelize.define("resources", {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true
    },
    topic_id: {
      type: Sequelize.UUID,
      allowNull: false
    },
    title: {
      type: Sequelize.STRING,
      allowNull: false
    },
    type: {
      type: Sequelize.ENUM('pdf', 'notes', 'slides'),
      allowNull: false
    },
    url: {
      type: Sequelize.STRING,
      allowNull: false
    }
  });

  return Resource;
};
