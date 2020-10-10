'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Forms', {
      key: {
        primaryKey: true,
        type: Sequelize.STRING(40),
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: true
        }
      },
      name: {
        type: Sequelize.STRING(150),
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      type: {
        type: Sequelize.DataTypes.ENUM,
        values: ['system', 'user'],
        allowNull: false
      },
      form: {
        type: Sequelize.DataTypes.JSONB,
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.DataTypes.NOW
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.DataTypes.NOW
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Forms');
  }
};
