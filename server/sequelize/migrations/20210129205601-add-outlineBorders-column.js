'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Preferences', 'listOutlineBorders', {
      type: Sequelize.DataTypes.BOOLEAN,
      defaultValue: true
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Preferences', 'listOutlineBorders');
  }
};
