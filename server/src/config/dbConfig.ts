const config = {
  development: {
    use_env_variable: 'DATABASE_URL'
  },
  production: {
    use_env_variable: 'DATABASE_URL',
    dialect: 'postgres',
    ssl: true,
    dialectOptions: {
      ssl: true
    }
  }
};

export default config;
