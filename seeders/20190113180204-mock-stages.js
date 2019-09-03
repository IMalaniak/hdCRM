'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.bulkInsert('Stages', [
        { id: 1, keyString: 'created' },
        { id: 2, keyString: 'inProgress' },
        { id: 3, keyString: 'finished' }
      ], {});
  },

  down: (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete('Stages', null, {});
  }
};
