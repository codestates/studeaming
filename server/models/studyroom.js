"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Studyroom extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Studyroom.init(
    {
      uuid: DataTypes.STRING,
      title: DataTypes.STRING,
      user_id: DataTypes.STRING,
      headCount: DataTypes.INTEGER,
      thumbnail: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Studyroom",
    }
  );
  return Studyroom;
};
