'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Users', 'login');
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Users', 'login', {
      type: Sequelize.DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true
      }
    });
  }
};
