
module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("users", {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true
    },
    name: {
      type: Sequelize.STRING,
      allowNull: true
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false
    },
    role: {
      type: Sequelize.ENUM('student', 'admin'),
      defaultValue: 'student'
    },
    joined_on: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW
    },
    avatar_url: {
      type: Sequelize.STRING,
      allowNull: true
    }
  });

  return User;
};
