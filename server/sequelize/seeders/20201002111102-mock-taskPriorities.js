'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('TaskPriorities', [
      { label: 'Not urgent or important', value: 1 },
      { label: 'Urgent not important', value: 2 },
      { label: 'Important not urgent', value: 3 },
      { label: 'Urgent and important', value: 4 }
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('TaskPriorities', null, {});
  }
};
