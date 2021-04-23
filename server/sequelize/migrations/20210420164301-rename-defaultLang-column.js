'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.renameColumn('Users', 'defaultLang', 'locale');
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.renameColumn('Users', 'locale', 'defaultLang');
  }
};
