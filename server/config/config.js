module.exports = {
  development: {
    username: "postgres",
    password: "postgresVanyA1901",
    port: 5432,
    database: "hdCRM",
    host: "localhost",
    dialect: "postgres"
  },
  production: {
    use_env_variable: "DATABASE_URL",
    dialect: "postgres",
    ssl: true,
    dialectOptions: {
      ssl: true
    } 
  }
}
