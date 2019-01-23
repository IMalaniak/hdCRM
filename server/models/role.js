module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define('Role', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    keyString: {
      type: DataTypes.STRING(50),
	    required: true
    }
  });
  Role.associate = function(models) {
    Role.belongsToMany(models.Privilege, {through: 'RolePrivileges', foreignKey: 'RoleId'});
    Role.belongsToMany(models.User, {through: 'UserRoles', foreignKey: 'RoleId'});
  };
  return Role;
};
