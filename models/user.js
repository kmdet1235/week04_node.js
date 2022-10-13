"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Users.init(
    {
      userId: {
        primaryKey: true,
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
      },
      nickname: { type: DataTypes.STRING, unique: true, allowNull: false },
      password: { type: DataTypes.STRING, unique: true, allowNull: false },
      // createdAt: {
      //   type: DataTypes.Date,
      //   defaultValue: DataTypes.NOW,
      //   allowNull: false,
      // },
      // updatedAt: {
      //   type: DataTypes.Date,
      //   defaultValue: DataTypes.NOW,
      //   allowNull: false,
      // },
    },
    {
      sequelize,
      modelName: "Users",
      timestamps: true,
    }
  );
  return Users;
};
