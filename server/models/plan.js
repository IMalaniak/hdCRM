
module.exports = (sequelize, DataTypes) => {
  const Plan = sequelize.define('Plan', {
    // id: {
    //   type: DataTypes.INTEGER,
    //   primaryKey: true,
    //   autoIncrement: true,
    //   allowNull: false
    // },
    title: {
      type: DataTypes.STRING(255),
	     required: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    deadline: {
      type: DataTypes.DATE
    },
    budget: {
      type: DataTypes.DECIMAL(19,4)
    },
    progress: {
      type: DataTypes.DECIMAL(5,2),
      max: 100
    }
  });
  Plan.associate = function(models) {
    Plan.belongsTo(models.User, {as: 'Creator'});
    Plan.belongsToMany(models.User, {as: 'Participants', through: 'UserPlans', foreignKey: 'PlanId'});
    Plan.belongsToMany(models.Asset, {as: 'Documents', through: 'PlanAssets', foreignKey: 'PlanId'});
    Plan.belongsTo(models.Stage, {as: 'activeStage'});
    Plan.belongsToMany(models.Stage, {as: 'Stages', through: models.PlanStages, foreignKey: 'PlanId'});
  };
  return Plan;
};
