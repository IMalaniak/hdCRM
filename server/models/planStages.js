module.exports = (sequelize, DataTypes) => {
  const PlanStages = sequelize.define('PlanStages', {
    // id: {
    //   type: DataTypes.INTEGER,
    //   primaryKey: true,
    //   autoIncrement: true,
    //   allowNull: false
    // },
    PlanId: DataTypes.INTEGER,
    StageId: DataTypes.INTEGER,
    description: {
      type: DataTypes.TEXT
    },
    order: {
      type: DataTypes.INTEGER,
  	  required: true,
      allowNull: false
    },
    completed: {
      type: DataTypes.BOOLEAN,
  	  required: true,
      allowNull: false     
    }
  }, {});
  PlanStages.associate = function(models) {
    // associations can be defined here
  };
  return PlanStages;
};