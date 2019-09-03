'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.removeConstraint('Plans', 'Plans_StageId_fkey');
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.addConstraint('Plans', ['StageId'], {
        type: 'foreign key',
        name: 'Plans_StageId_fkey',
        references: { //Required field
          table: 'Stages',
          field: 'id'
        },
        onDelete: 'cascade',
        onUpdate: 'cascade'      
      });
  }
};