'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.bulkInsert('UserAssets', [
        { createdAt: new Date(), updatedAt: new Date(), AssetId: 1, UserId: 1 }
      ], {});
  },

  down: (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete('UserAssets', null, {});
  }
};
