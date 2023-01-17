const {
  DB_DIALECT,
  DB_HOST,
  DB_NAME,
  DB_PASSWORD,
  DB_USER,
} = require("../config/db.config");
const { Sequelize } = require("sequelize");
const userModel = require("./userModel");
const logger = require("./../utils/logger");
// connect to Database
const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  dialect: DB_DIALECT,
});

const db = {};

db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.users = userModel(sequelize, Sequelize.DataTypes);

// check if the connection is successfull
sequelize
  .authenticate()
  .then(() => logger.info("database connected successfuly"))
  .catch((err) => logger.error("unable to connect", err));

// sync the table
db.sequelize
  .sync({ force: false })
  .then(() => logger.info("table sync successful"))
  .catch((err) => logger.error(err));

module.exports = db;
