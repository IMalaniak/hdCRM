'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Plans', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.DataTypes.INTEGER
      },
      title: {
        type: Sequelize.DataTypes.STRING(255),
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      description: {
        type: Sequelize.DataTypes.TEXT
      },
      deadline: {
        type: Sequelize.DataTypes.DATE
      },
      budget: {
        type: Sequelize.DataTypes.DECIMAL(19, 4)
      },
      progress: {
        type: Sequelize.DataTypes.DECIMAL(5, 2)
      },
      OrganizationId: {
        type: Sequelize.DataTypes.INTEGER,
        references: {
          model: {
            tableName: 'Organizations'
          },
          key: 'id'
        },
        allowNull: false
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
      activeStageId: {
        type: Sequelize.DataTypes.INTEGER,
        references: {
          model: {
            tableName: 'Stages'
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
    return queryInterface.dropTable('Plans');
  }
};
