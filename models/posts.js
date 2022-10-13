"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Posts extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Posts.init(
    {
      postId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      userId: { type: DataTypes.STRING, allowNull: false },
      nickname: { type: DataTypes.STRING, unique: true, allowNull: false },
      title: { type: DataTypes.STRING, unique: true, allowNull: false },
      content: { type: DataTypes.STRING, unique: true, allowNull: false },
      likes: { type: DataTypes.INTEGER, defaultValue: 0 },
    },
    {
      sequelize,
      modelName: "Posts",
    }
  );
  return Posts;
};
