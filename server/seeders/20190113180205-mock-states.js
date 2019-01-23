'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.bulkInsert('States', [
        { id: 1, keyString: 'initialized' },
        { id: 2, keyString: 'active' },
        { id: 3, keyString: 'disabled' },
        { id: 4, keyString: 'archive' }
      ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('State', null, {});
  }
};
