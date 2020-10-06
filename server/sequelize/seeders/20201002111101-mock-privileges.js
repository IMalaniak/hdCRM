'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Privileges', [
      { keyString: 'user', title: 'User Management' },
      { keyString: 'department', title: 'Department Management' },
      { keyString: 'role', title: 'Role Management' },
      { keyString: 'stages', title: 'User Management' },
      { keyString: 'plan', title: 'Plan Management' },
      { keyString: 'planAttachment', title: 'Plan Attachment Management' },
      { keyString: 'organizationTab', title: 'Organization Tab Management' },
      { keyString: 'integrationTab', title: 'Integration Tab Management' },
      { keyString: 'preferenceTab', title: 'Preference Tab Management' }
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Privileges', null, {});
  }
};
