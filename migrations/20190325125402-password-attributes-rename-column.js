'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.renameColumn('PasswordAttributes', 'resetPasswordTokenExpire', 'tokenExpire');
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.renameColumn('PasswordAttributes', 'tokenExpire', 'resetPasswordTokenExpire');
  }
};