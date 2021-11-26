"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Currentlog extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Currentlog.init(
    {
      user_id: DataTypes.INTEGER,
      name: DataTypes.STRING,
      color: DataTypes.STRING,
      isOn: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Currentlog",
    }
  );
  return Currentlog;
};
