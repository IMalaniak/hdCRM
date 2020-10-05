'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Organizations', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.DataTypes.INTEGER
      },
      title: {
        type: new Sequelize.DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: true
        }
      },
      token: {
        type: Sequelize.DataTypes.STRING,
        unique: true
      },
      type: {
        type: new Sequelize.DataTypes.STRING(15),
        allowNull: false
      },
      country: Sequelize.DataTypes.STRING(50),
      city: Sequelize.DataTypes.STRING(50),
      address: Sequelize.DataTypes.STRING(50),
      postcode: Sequelize.DataTypes.STRING(10),
      phone: Sequelize.DataTypes.STRING,
      email: {
        type: Sequelize.DataTypes.STRING,
        unique: true
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
    return queryInterface.dropTable('Organizations');
  }
};
