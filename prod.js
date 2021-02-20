module.exports = {
    PASSWORD: process.env.PASSWORD,
    EMAIL: process.env.EMAIL,
    MAIN_URL: process.env.MAIN_URL,
    SERVICE: process.env.SERVICE,
    GMAIL_SERVICE_PORT: process.env.GMAIL_SERVICE_PORT,
    database: {
      host: process.env.HOST,
      port: process.env.PORT_DB,
      user: process.env.USER,
      password: process.env.PASSWORD_DB,
      dialect: process.env.DIALECT,
      database: process.env.NAME_DB
  }
  };