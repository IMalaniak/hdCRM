'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('RolePrivileges', {
      RoleId: {
        type: Sequelize.DataTypes.INTEGER,
        references: {
          model: {
            tableName: 'Roles'
          },
          key: 'id'
        },
        onDelete: 'cascade',
        onUpdate: 'cascade',
        allowNull: false
      },
      PrivilegeId: {
        type: Sequelize.DataTypes.INTEGER,
        references: {
          model: {
            tableName: 'Privileges'
          },
          key: 'id'
        },
        onDelete: 'cascade',
        onUpdate: 'cascade',
        allowNull: false
      },
      view: {
        type: Sequelize.DataTypes.BOOLEAN,
        defaultValue: true
      },
      add: {
        type: Sequelize.DataTypes.BOOLEAN,
        defaultValue: false
      },
      edit: {
        type: Sequelize.DataTypes.BOOLEAN,
        defaultValue: false
      },
      delete: {
        type: Sequelize.DataTypes.BOOLEAN,
        defaultValue: false
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
    return queryInterface.dropTable('RolePrivileges');
  }
};
