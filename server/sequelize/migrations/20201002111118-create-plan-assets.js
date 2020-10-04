'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('PlanAssets', {
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
    return queryInterface.dropTable('PlanAssets');
  }
};
