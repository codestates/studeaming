'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class daily extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  daily.init({
    user_id: DataTypes.INTEGER,
    date: DataTypes.DATEONLY,
    comment: DataTypes.STRING,
    studyTime: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'daily',
  });
  return daily;
};