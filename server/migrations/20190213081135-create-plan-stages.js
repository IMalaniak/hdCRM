'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('PlanStages', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      PlanId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Plans',
          key: 'id'
        },
        allowNull: false,
      },
      StageId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Stages',
          key: 'id'
        },
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT
      },
      order: {
        type: Sequelize.INTEGER,
        required: true,
        allowNull: false
      },
      completed: {
        type: Sequelize.BOOLEAN,
        required: true,
        allowNull: false     
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('PlanStages');
  }
};