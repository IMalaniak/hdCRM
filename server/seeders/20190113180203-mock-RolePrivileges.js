'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.bulkInsert('RolePrivileges', [
        { createdAt: new Date(), updatedAt: new Date(), PrivilegeId: 1, RoleId: 1 },
        { createdAt: new Date(), updatedAt: new Date(), PrivilegeId: 2, RoleId: 1 },
        { createdAt: new Date(), updatedAt: new Date(), PrivilegeId: 3, RoleId: 1 },
        { createdAt: new Date(), updatedAt: new Date(), PrivilegeId: 4, RoleId: 1 },
        { createdAt: new Date(), updatedAt: new Date(), PrivilegeId: 5, RoleId: 1 },
        { createdAt: new Date(), updatedAt: new Date(), PrivilegeId: 6, RoleId: 1 },
        { createdAt: new Date(), updatedAt: new Date(), PrivilegeId: 7, RoleId: 1 },
        { createdAt: new Date(), updatedAt: new Date(), PrivilegeId: 8, RoleId: 1 },
        { createdAt: new Date(), updatedAt: new Date(), PrivilegeId: 9, RoleId: 1 },
        { createdAt: new Date(), updatedAt: new Date(), PrivilegeId: 10, RoleId: 1 }
      ], {});
  },

  down: (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete('RolePrivileges', null, {});
  }
};
