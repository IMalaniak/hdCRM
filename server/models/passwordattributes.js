'use strict';
module.exports = (sequelize, DataTypes) => {
  const PasswordAttributes = sequelize.define('PasswordAttributes', {
    UserId: DataTypes.INTEGER,
    resetPasswordToken: DataTypes.STRING,
    resetPasswordTokenExpire: DataTypes.DATE
  }, {});
  PasswordAttributes.associate = function(models) {
    PasswordAttributes.belongsTo(models.User);
  };
  return PasswordAttributes;
};

