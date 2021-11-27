"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Daily extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Daily.init(
    {
      user_id: DataTypes.INTEGER,
      date: DataTypes.DATEONLY,
      comment: DataTypes.STRING,
      studyTime: DataTypes.INTEGER,
    },
    {
      createdAt: false,
      updatedAt: false,
      sequelize,
      modelName: "Daily",
    }
  );
  return Daily;
};
