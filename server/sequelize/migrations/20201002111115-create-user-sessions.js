'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('UserSession', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.DataTypes.INTEGER
      },
      UserId: {
        type: Sequelize.DataTypes.INTEGER,
        references: {
          model: {
            tableName: 'Users'
          },
          key: 'id'
        },
        onDelete: 'set null',
        onUpdate: 'cascade',
        allowNull: false
      },
      IP: {
        type: Sequelize.DataTypes.STRING(20)
      },
      isSuccess: Sequelize.DataTypes.BOOLEAN,
      UA: {
        type: Sequelize.DataTypes.STRING
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('UserSession');
  }
};
