'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('Users', 'picture', {
        type: Sequelize.DataTypes.STRING,
        allowNull: true
      }),
      queryInterface.addColumn('Users', 'googleId', {
        type: Sequelize.DataTypes.STRING,
        allowNull: true
      })
    ]);
  },
  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('Users', 'picture'),
      queryInterface.removeColumn('Users', 'googleId')
    ]);
  }
};
