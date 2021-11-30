"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Users", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      username: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      email: {
        type: Sequelize.STRING,
      },
      password: {
        type: Sequelize.STRING,
      },
      profileImg: {
        allowNull: false,
        type: Sequelize.STRING,
        defaultValue: "",
      },
      about: {
        allowNull: false,
        type: Sequelize.STRING,
        defaultValue: "",
      },
      studeaming: {
        allowNull: false,
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      watching: {
        allowNull: false,
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      isEmailVerified: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      emailVerifyCode: {
        type: Sequelize.STRING,
      },
      platformType: {
        type: Sequelize.STRING,
      },
      authCode: {
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("NOW()"),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("NOW()"),
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Users");
  },
};
