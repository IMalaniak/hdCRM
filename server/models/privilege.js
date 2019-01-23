module.exports = (sequelize, DataTypes) => {
  const Privilege = sequelize.define('Privilege', {
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
  },{
    timestamps: false
  });
  Privilege.associate = function(models) {
    Privilege.belongsToMany(models.Role, {through: 'RolePrivileges', foreignKey: 'PrivilegeId'});
  };
  return Privilege;
};
