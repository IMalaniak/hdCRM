module.exports = (sequelize, DataTypes) => {
  const UserLoginHistory = sequelize.define('UserLoginHistory', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
  	IP:  {
      type: DataTypes.STRING(20)
    },
  	dateLastLoggedIn: {
      type: DataTypes.DATE
    }
  }, {
    freezeTableName: true,
    timestamps: false
  });
  UserLoginHistory.associate = function(models) {
    UserLoginHistory.belongsTo(models.User);
  };
  return UserLoginHistory;
};
