module.exports = {
  development: {
    use_env_variable: 'DATABASE_URL',
    migrationStorage: 'sequelize',
    seederStorage: 'sequelize'
  },
  production: {
    use_env_variable: 'DATABASE_URL',
    ssl: true,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
    migrationStorage: 'sequelize',
    seederStorage: 'sequelize'
  },
  test: {
    use_env_variable: 'DATABASE_URL',
    ssl: true,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
    migrationStorage: 'sequelize',
    seederStorage: 'sequelize'
  }
};
