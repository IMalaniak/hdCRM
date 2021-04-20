'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([queryInterface.removeColumn('Users', 'avatarId'), queryInterface.dropTable('UserAssets')]);
  },
  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('Users', 'avatarId', {
        type: Sequelize.DataTypes.INTEGER,
        references: {
          model: {
            tableName: 'Assets'
          },
          key: 'id'
        }
      }),
      queryInterface.createTable('UserAssets', {
        AssetId: {
          type: Sequelize.DataTypes.INTEGER,
          references: {
            model: {
              tableName: 'Assets'
            },
            key: 'id'
          },
          onDelete: 'cascade',
          onUpdate: 'cascade',
          allowNull: false
        },
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
          type: Sequelize.DATE,
          defaultValue: Sequelize.DataTypes.NOW
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue: Sequelize.DataTypes.NOW
        }
      })
    ]);
  }
};
