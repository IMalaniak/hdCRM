'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Organizations', 'website', {
      type: Sequelize.DataTypes.STRING(100),
      unique: true,
      validate: {
        isUrl: true
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Organizations', 'website');
  }
};
