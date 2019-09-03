'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.renameColumn('PasswordAttributes', 'resetPasswordToken', 'token');
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.renameColumn('PasswordAttributes', 'token', 'resetPasswordToken');
  }
};