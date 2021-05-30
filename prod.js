module.exports = {
  GMAIL_PASSWORD: process.env.GMAIL_PASSWORD,
  GMAIL_USER_NAME: process.env.GMAIL_USER_NAME,
  GMAIL_HOST: process.env.GMAIL_HOST,
    SERVICE: process.env.SERVICE,
    GMAIL_SERVICE_PORT: process.env.GMAIL_SERVICE_PORT,
    GMAIL_SERVICE_SECURE: process.env.GMAIL_SERVICE_SECURE,
    
    database: {
      host: process.env.HOST,
      port: process.env.PORT_DB,
      user: process.env.USER,
      password: process.env.PASSWORD_DB,
      dialect: process.env.DIALECT,
      database: process.env.NAME_DB
  }
  };