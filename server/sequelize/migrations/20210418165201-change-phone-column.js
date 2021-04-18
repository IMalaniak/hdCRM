'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('Users', 'phone', {
      type: Sequelize.DataTypes.STRING,
      unique: true
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('Users', 'phone', {
      type: Sequelize.DataTypes.CHAR(15),
      unique: true
    });
  }
};
