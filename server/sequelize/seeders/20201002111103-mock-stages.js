'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Stages', [
      { keyString: 'created' },
      { keyString: 'inProgress' },
      { keyString: 'finished' }
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Stages', null, {});
  }
};
