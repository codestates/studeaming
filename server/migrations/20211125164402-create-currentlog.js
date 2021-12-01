"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Currentlogs", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      user_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING,
        defaultValue: "공부",
      },
      color: {
        allowNull: false,
        type: Sequelize.STRING,
        defaultValue: "#a5c7e5",
      },
      isOn: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Currentlogs");
  },
};
