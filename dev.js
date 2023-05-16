module.exports = {
  GMAIL_PASSWORD: process.env.GMAIL_PASSWORD,
  GMAIL_USER_NAME: process.env.GMAIL_USER_NAME,
  GMAIL_HOST: process.env.GMAIL_HOST,
  SERVICE: process.env.SERVICE,
  GMAIL_SERVICE_PORT: process.env.GMAIL_SERVICE_PORT,
  GMAIL_SERVICE_SECURE: false,

  GMAIL_SERVICE_PORT: 465,
  database: {
    host: "localhost",
    port: "3000",
    user: "root",
    password: "mysecret",
    dialect: "mysql",
    database: "livraison",
  },
};
