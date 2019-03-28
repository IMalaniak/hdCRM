'use strict';
module.exports = (sequelize, DataTypes) => {
  const PasswordAttributes = sequelize.define('PasswordAttributes', {
    UserId: DataTypes.INTEGER,
    token: DataTypes.STRING,
    tokenExpire: DataTypes.DATE,
    passwordExpire: DataTypes.DATE
  }, {});
  PasswordAttributes.associate = function(models) {
    PasswordAttributes.belongsTo(models.User);
  };
  return PasswordAttributes;
};

