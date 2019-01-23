'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.bulkInsert('Roles', [
        { id: 1, keyString: 'root', createdAt: new Date(), updatedAt: new Date() }
      ], {});
  },

  down: (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete('Roles', null, {});
  }
};
