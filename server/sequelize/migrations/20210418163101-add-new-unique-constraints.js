'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addConstraint('Users', {
        fields: ['phone'],
        type: 'unique',
        name: 'Users_phone_key'
      }),
      queryInterface.addConstraint('Organizations', {
        fields: ['phone'],
        type: 'unique',
        name: 'Organizations_phone_key'
      })
    ]);
  },
  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeConstraint('Users', 'Users_phone_key'),
      queryInterface.removeConstraint('Organizations', 'Organizations_phone_key')
    ]);
  }
};
