'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.renameColumn('Plans', 'StageId', 'activeStageId');
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.renameColumn('Plans', 'activeStageId', 'StageId');
  }
};