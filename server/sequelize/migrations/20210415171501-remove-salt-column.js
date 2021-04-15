'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Users', 'salt');
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Users', 'salt', {
      type: Sequelize.DataTypes.STRING(100),
      allowNull: false
    });
  }
};
