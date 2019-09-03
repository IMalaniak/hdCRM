'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addConstraint('PasswordAttributes', ['UserId'], {
      type: 'foreign key',
      name: 'PasswordAttributes_UserId_fkey',
      references: {
        table: 'Users',
        field: 'id'
      },
      onDelete: 'cascade',
      onUpdate: 'cascade' 
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.removeConstraint('PasswordAttributes', 'PasswordAttributes_UserId_fkey');
  }
};