
module.exports = (sequelize, Sequelize) => {
  const Week = sequelize.define("weeks", {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true
    },
    course_id: {
      type: Sequelize.UUID,
      allowNull: false
    },
    title: {
      type: Sequelize.STRING,
      allowNull: false
    },
    order_number: {
      type: Sequelize.INTEGER,
      allowNull: false
    }
  });

  return Week;
};
