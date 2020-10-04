'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.DataTypes.INTEGER
      },
      name: {
        type: Sequelize.DataTypes.STRING(50),
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      surname: {
        type: Sequelize.DataTypes.STRING(50),
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      phone: {
        type: Sequelize.DataTypes.CHAR(15)
      },
      email: {
        type: Sequelize.DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: true,
          isEmail: true
        }
      },
      login: {
        type: Sequelize.DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: true
        }
      },
      passwordHash: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false
      },
      salt: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false
      },
      defaultLang: {
        type: Sequelize.DataTypes.CHAR(2)
      },
      state: {
        type: Sequelize.DataTypes.ENUM,
        values: ['initialized', 'active', 'disabled', 'archive'],
        allowNull: false,
        defaultValue: 'initialized'
      },
      OrganizationId: {
        type: Sequelize.DataTypes.INTEGER,
        references: {
          model: {
            tableName: 'Organizations'
          },
          key: 'id'
        },
        allowNull: false
      },
      RoleId: {
        type: Sequelize.DataTypes.INTEGER,
        references: {
          model: {
            tableName: 'Roles'
          },
          key: 'id'
        }
      },
      DepartmentId: {
        type: Sequelize.DataTypes.INTEGER,
        references: {
          model: {
            tableName: 'Departments'
          },
          key: 'id'
        }
      },
      avatarId: {
        type: Sequelize.DataTypes.INTEGER,
        references: {
          model: {
            tableName: 'Assets'
          },
          key: 'id'
        }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DataTypes.DATE,
        defaultValue: Sequelize.DataTypes.NOW
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DataTypes.DATE,
        defaultValue: Sequelize.DataTypes.NOW
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Users');
  }
};
