module.exports = (sequelize, DataTypes) => {
  const State = sequelize.define('State', {
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
  State.associate = function(models) {
    State.hasMany(models.User);
  };
  return State;
};
