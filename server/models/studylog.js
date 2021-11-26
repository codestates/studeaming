'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class studylog extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  studylog.init({
    user_id: DataTypes.STRING,
    name: DataTypes.STRING,
    color: DataTypes.STRING,
    startedAt: DataTypes.DATE,
    finishedAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'studylog',
  });
  return studylog;
};