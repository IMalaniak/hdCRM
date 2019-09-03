'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('PasswordAttributes', 'passwordExpire', Sequelize.DATE);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('PasswordAttributes', 'passwordExpire');
  }
};