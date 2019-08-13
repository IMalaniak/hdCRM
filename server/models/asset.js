module.exports = (sequelize, DataTypes) => {
  const Asset = sequelize.define('Asset', {
    // id: {
    //   type: DataTypes.INTEGER,
    //   primaryKey: true,
    //   autoIncrement: true,
    //   allowNull: false
    // },
    title: {
      type: DataTypes.STRING(250),
	    required: true
    },
    location: {
      type: DataTypes.STRING(250),
	    required: true
    },
    type: {
      type: DataTypes.STRING(250),
      required: true
    }
  });
  Asset.associate = function(models) {
    Asset.belongsToMany(models.User, {through: 'UserAssets', foreignKey: 'AssetId'});
    Asset.belongsToMany(models.Plan, {as: 'Documents', through: 'PlanAssets', foreignKey: 'AssetId'});
  };
  return Asset;
};
