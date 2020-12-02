'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addConstraint('Users', {
        fields: ['RoleId'],
        type: 'foreign key',
        name: 'Users_RoleId_fkey',
        references: {
          table: 'Roles',
          field: 'id'
        },
        onDelete: 'set null',
        onUpdate: 'cascade'
      }),
      queryInterface.addConstraint('Users', {
        fields: ['DepartmentId'],
        type: 'foreign key',
        name: 'Users_DepartmentId_fkey',
        references: {
          table: 'Departments',
          field: 'id'
        },
        onDelete: 'set null',
        onUpdate: 'cascade'
      })
    ]);
  },
  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeConstraint('Users', 'Users_RoleId_fkey'),
      queryInterface.removeConstraint('Users', 'Users_DepartmentId_fkey')
    ]);
  }
};
