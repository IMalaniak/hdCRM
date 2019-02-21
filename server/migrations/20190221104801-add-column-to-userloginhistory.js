'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('UserLoginHistory', 'dateUnsuccessfulLogIn', {
      type: Sequelize.DATE
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('UserLoginHistory', 'dateUnsuccessfulLogIn');
  }
};