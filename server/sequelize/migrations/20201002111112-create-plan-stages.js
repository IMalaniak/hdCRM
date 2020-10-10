'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('PlanStages', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.DataTypes.INTEGER
      },
      PlanId: {
        type: Sequelize.DataTypes.INTEGER,
        references: {
          model: {
            tableName: 'Plans'
          },
          key: 'id'
        },
        onDelete: 'cascade',
        onUpdate: 'cascade',
        allowNull: false
      },
      StageId: {
        type: Sequelize.DataTypes.INTEGER,
        references: {
          model: {
            tableName: 'Stages'
          },
          key: 'id'
        },
        onDelete: 'cascade',
        onUpdate: 'cascade',
        allowNull: false
      },
      description: {
        type: Sequelize.DataTypes.TEXT
      },
      order: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false
      },
      completed: {
        type: Sequelize.DataTypes.BOOLEAN,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DataTypes.DATE,
        defaultValue: Sequelize.DataTypes.NOW
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DataTypes.DATE,
        defaultValue: Sequelize.DataTypes.NOW
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('PlanStages');
  }
};
