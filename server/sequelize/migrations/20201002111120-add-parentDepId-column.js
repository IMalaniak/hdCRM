'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Departments', 'parentDepId', {
      type: Sequelize.DataTypes.INTEGER,
      references: {
        model: {
          tableName: 'Departments'
        },
        key: 'id'
      },
      onDelete: 'set null',
      onUpdate: 'cascade',
      allowNull: false
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Department', 'parentDepId');
  }
};
