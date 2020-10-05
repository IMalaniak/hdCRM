'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('PasswordAttributes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.DataTypes.INTEGER
      },
      token: {
        type: Sequelize.DataTypes.STRING,
        unique: true
      },
      tokenExpire: Sequelize.DataTypes.DATE,
      passwordExpire: Sequelize.DataTypes.DATE,
      UserId: {
        type: Sequelize.DataTypes.INTEGER,
        references: {
          model: {
            tableName: 'Users'
          },
          key: 'id'
        },
        onDelete: 'cascade',
        onUpdate: 'cascade',
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
    return queryInterface.dropTable('PasswordAttributes');
  }
};
