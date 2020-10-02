module.exports = {
  development: {
    use_env_variable: 'DATABASE_URL',
    dialect: 'postgres',
    migrationStorage: 'sequelize',
    seederStorage: 'sequelize'
  },
  production: {
    use_env_variable: 'DATABASE_URL',
    dialect: 'postgres',
    dialectOptions: {
      ssl: true,
      rejectUnauthorized: false
    },
    migrationStorage: 'sequelize',
    seederStorage: 'sequelize'
  },
  test: {
    use_env_variable: 'DATABASE_URL',
    dialect: 'postgres',
    migrationStorage: 'sequelize',
    seederStorage: 'sequelize'
  }
};
