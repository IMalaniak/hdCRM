'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Preferences', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.DataTypes.INTEGER
      },
      listView: {
        type: Sequelize.DataTypes.ENUM,
        values: ['list', 'card'],
        allowNull: false,
        defaultValue: 'list'
      },
      timeFormat: {
        type: Sequelize.DataTypes.ENUM,
        values: ['h:mm a', 'h:mm:ss a', 'h:mm:ss a z'],
        allowNull: false,
        defaultValue: 'h:mm:ss a z'
      },
      dateFormat: {
        type: Sequelize.DataTypes.ENUM,
        values: ['M/d/yy', 'MMM d, y', 'MMMM d, y', 'EEEE, MMMM d, y'],
        allowNull: false,
        defaultValue: 'EEEE, MMMM d, y'
      },
      itemsPerPage: {
        type: Sequelize.DataTypes.ENUM,
        values: ['5', '10', '15'],
        allowNull: false,
        defaultValue: '5'
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
    return queryInterface.dropTable('Preferences');
  }
};
