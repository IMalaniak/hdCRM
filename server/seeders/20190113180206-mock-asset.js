'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.bulkInsert('Assets', [
        { id: 1, createdAt: new Date(), updatedAt: new Date(), title: 'myWebMaster.jpg', location: '/userpics/', type: 'image' }
      ], {});
  },

  down: (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete('Assets', null, {});
  }
};
