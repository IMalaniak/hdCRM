'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Tasks', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.DataTypes.INTEGER
      },
      title: {
        type: Sequelize.DataTypes.STRING(75),
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      description: Sequelize.DataTypes.TEXT,
      isCompleted: {
        type: Sequelize.DataTypes.BOOLEAN,
        defaultValue: false
      },
      CreatorId: {
        type: Sequelize.DataTypes.INTEGER,
        references: {
          model: {
            tableName: 'Users'
          },
          key: 'id'
        },
        allowNull: false
      },
      TaskPriorityId: {
        type: Sequelize.DataTypes.INTEGER,
        references: {
          model: {
            tableName: 'TaskPriorities'
          },
          key: 'id'
        },
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
    return queryInterface.dropTable('Tasks');
  }
};
