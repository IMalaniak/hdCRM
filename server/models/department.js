'use strict';
module.exports = (sequelize, DataTypes) => {
  const Department = sequelize.define('Department', {
    title: DataTypes.STRING,
    description: DataTypes.STRING,
    managerId: DataTypes.INTEGER,
    parentDepId: DataTypes.INTEGER
  }, {});
  Department.associate = function(models) {
    Department.belongsTo(Department, {as: 'ParentDepartment', foreignKey: 'parentDepId'});
    Department.hasMany(Department, {as: 'SubDepartments', foreignKey: 'parentDepId'});
    Department.hasMany(models.User, {as: 'Workers', constraints: false});
    Department.belongsTo(models.User, {as: 'Manager', foreignKey: 'managerId'});
  };
  return Department;
};