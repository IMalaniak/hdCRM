'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Users', 'passwordHash');
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Users', 'passwordHash', {
      type: Sequelize.DataTypes.STRING(100),
      allowNull: false
    });
  }
};
