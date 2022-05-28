const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('avatar', {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    avatar: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'avatar',
    schema: 'public',
    timestamps: true,
    paranoid: true,
    indexes: [
      {
        name: "avatar_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
