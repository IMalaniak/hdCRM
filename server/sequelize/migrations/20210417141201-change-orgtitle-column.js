'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('Organizations', 'title', {
      type: Sequelize.DataTypes.STRING(50),
      unique: true,
      allowNull: true
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('Organizations', 'title', {
      type: Sequelize.DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true
      }
    });
  }
};
