"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class user_achievement extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  user_achievement.init(
    {
      user_id: DataTypes.INTEGER,
      achievement_id: DataTypes.INTEGER,
    },
    {
      createdAt: false,
      updatedAt: false,
      sequelize,
      modelName: "user_achievement",
    }
  );
  return user_achievement;
};
