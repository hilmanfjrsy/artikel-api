var DataTypes = require("sequelize").DataTypes;
var _comments = require("./comments");

function initModels(sequelize) {
  var comments = _comments(sequelize, DataTypes);


  return {
    comments,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
