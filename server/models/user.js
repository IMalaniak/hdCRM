module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
  	email:  {
      type: DataTypes.STRING(50),
  	  required: true,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
        isEmail: true
      }
    },
  	login: {
      type: DataTypes.STRING(50),
  	  required: true,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true
      }
    },
  	name:  {
      type: DataTypes.STRING(50) 
    },
  	surname:  {
      type: DataTypes.STRING(50)
    },
    phone:  {
      type: DataTypes.CHAR(15)
    },
  	passwordHash:  {
      type: DataTypes.STRING,
  	  required: true,
      allowNull: false
    },
  	salt:  {
      type: DataTypes.STRING,
  	  required: true,
      allowNull: false
    },
    defaultLang: {
      type: DataTypes.CHAR(2)
    }
  },{
    indexes: [
      {
        unique: true,
        fields: ['email']
      }, {
        unique: true,
        fields: ['login']    
      }
    ]
  });
  User.associate = function(models) {
    User.belongsToMany(models.Role, {through: 'UserRoles', foreignKey: 'UserId'});
    User.belongsToMany(models.Asset, {through: 'UserAssets', foreignKey: 'UserId'});
    User.belongsTo(models.Asset, {as: 'avatar'});
    User.belongsToMany(models.Plan, {as: 'PlansTakesPartIn', through: 'UserPlans', foreignKey: 'UserId'});
    User.belongsTo(models.State);
    User.hasOne(models.UserLoginHistory);
    User.hasOne(models.Department, {as: 'ManagedDepartment', foreignKey: 'managerId'});
    User.belongsTo(models.Department, {constraints: false});
    User.hasOne(models.PasswordAttributes, {as: 'PasswordAttributes', foreignKey: 'UserId'});
  };
  return User;
};
