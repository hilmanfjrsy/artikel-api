var Sequelize = require('sequelize')
var sequelize = require('../config/db.config')
var DataType = Sequelize.DataTypes
//BARIS CODE UNTUK DEKLARASI MODEL

var users = require('./users')(sequelize, DataType)
var avatar = require('./avatar')(sequelize, DataType)
var user_views = require('./user_views')(sequelize, DataType)
var articles = require('./articles')(sequelize, DataType)
var comments = require('./comments')(sequelize, DataType)

articles.belongsTo(users, { foreignKey: 'user_id' })
users.belongsTo(avatar, { foreignKey: 'avatar_id' })

var db = {
    sequelize,
    Sequelize,
    users,
    avatar,
    user_views,
    articles,
    comments
}
module.exports = db