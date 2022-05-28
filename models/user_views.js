const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('user_views', {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    article_id: {
      type: DataTypes.UUID,
      allowNull: true
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: true
    },
    duration: {
      type: DataTypes.SMALLINT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'user_views',
    schema: 'public',
    timestamps: true,
    paranoid: true,
    indexes: [
      {
        name: "user_views_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
