'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.bulkInsert('Users', [
        { id: 1, email: "admin@mywebmaster.pp.ua", login: 'adminIAM', name: "IAM", surname: "Administrator", phone: '+48570797098', passwordHash: '2081824ed6cc13a7ca26772cd284b01b9d570d3c80f122767cd6a96ce5b8d93f9dd36ac1b5962c06e9638d8ee7e94947dbcff238b8309af6ae17b81b522d3b11', salt: '7f6d4159eb87e3ed', defaultLang: 'en', createdAt: new Date(), updatedAt: new Date(), StateId: 2, avatarId: 1 }
      ], {});
  },

  down: (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete('Users', null, {});
  }
};