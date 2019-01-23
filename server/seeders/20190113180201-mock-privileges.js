'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.bulkInsert('Privileges', [
        { id: 1, keyString: 'editUser' },
        { id: 2, keyString: 'deleteUser' },
        { id: 3, keyString: 'addUser' },
        { id: 4, keyString: 'editPlan' },
        { id: 5, keyString: 'deletePlan' },
        { id: 6, keyString: 'addPlan' },
        { id: 7, keyString: 'editRole' },
        { id: 8, keyString: 'deleteRole' },
        { id: 9, keyString: 'addRole' },
        { id: 10, keyString: 'showDebug' }
      ], {});
  },

  down: (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete('Privileges', null, {});
  }
};
