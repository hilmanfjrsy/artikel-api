const Sequelize = require('sequelize')

var env = process.env.ENV

var db_name = process.env[env + "_DB_NAME"]
var db_username = process.env[env + "_DB_USER"]
var db_password = process.env[env + "_DB_PASSWORD"]
var db_host = process.env[env + "_DB_HOST"]
var db_dialect = process.env[env + "_DB_DIALECT"]
module.exports = new Sequelize(db_name, db_username, db_password, {
    host: db_host,
    dialect: db_dialect,
    timezone: 'Asia/Jakarta',
    logging: env == 'DEV' ? false : false
});