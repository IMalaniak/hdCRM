'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('TaskPriorities', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.DataTypes.INTEGER
      },
      label: {
        type: Sequelize.DataTypes.STRING(50),
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      value: {
        type: Sequelize.DataTypes.INTEGER
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('TaskPriorities');
  }
};
