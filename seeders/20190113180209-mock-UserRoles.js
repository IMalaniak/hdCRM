'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.bulkInsert('UserRoles', [
        { createdAt: new Date(), updatedAt: new Date(), RoleId: 1, UserId: 1 }
      ], {});
  },

  down: (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete('UserRoles', null, {});
  }
};
