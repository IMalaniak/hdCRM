'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addConstraint('Users', ['DepartmentId'], {
      type: 'foreign key',
      name: 'Users_DepartmentId_fkey',
      references: {
        table: 'Departments',
        field: 'id'
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.removeConstraint('Users', 'Users_DepartmentId_fkey');
  }
};