'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addConstraint('Plans', ['activeStageId'], {
        type: 'foreign key',
        name: 'Plans_activeStageId_fkey',
        references: { //Required field
          table: 'Stages',
          field: 'id'
        },
        onDelete: 'cascade',
        onUpdate: 'cascade'      
      });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.removeConstraint('Plans', 'Plans_activeStageId_fkey');
  }
};