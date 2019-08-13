module.exports = (sequelize, DataTypes) => {
  const Stage = sequelize.define('Stage', {
    // id: {
    //   allowNull: false,
    //   autoIncrement: true,
    //   primaryKey: true,
    //   type: DataTypes.INTEGER
    // },
    keyString: {
      type: DataTypes.STRING(255)
    }
  }, {
    timestamps: false
  });
  Stage.associate = function(models) {
    Stage.hasMany(models.Plan, {foreignKey: 'activeStageId'});
    Stage.belongsToMany(models.Plan, {as: 'StagePlans', through: models.PlanStages, foreignKey: 'StageId'});
  };
  return Stage;
};
