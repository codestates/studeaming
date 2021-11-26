"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class user_follower extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  user_follower.init(
    {
      user_id: DataTypes.INTEGER,
      studeamer_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "user-follower",
    }
  );
  return user_follower;
};
