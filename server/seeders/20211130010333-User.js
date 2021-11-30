"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      "Users",
      [
        {
          username: "김코딩",
          password:
            "$2b$10$UVVoof14GBtep.xOHkMFGOroatfwJNMIgv8VNIFd2j.BTZyDCkVV6",
          email: "coding@gmail.com",
          isEmailVerified: true,
          platformType: "original",
          createdAt: new Date(),
          updatedAt: new Date(),
          studeaming: 120,
        },
        {
          username: "김토끼",
          password:
            "$2b$10$UVVoof14GBtep.xOHkMFGOroatfwJNMIgv8VNIFd2j.BTZyDCkVV6",
          email: "rabbit@gmail.com",
          isEmailVerified: true,
          platformType: "original",
          createdAt: new Date(),
          updatedAt: new Date(),
          studeaming: 0,
        },
        {
          username: "김멍멍",
          password:
            "$2b$10$UVVoof14GBtep.xOHkMFGOroatfwJNMIgv8VNIFd2j.BTZyDCkVV6",
          email: "love@gmail.com",
          isEmailVerified: true,
          platformType: "original",
          createdAt: new Date(),
          updatedAt: new Date(),
          studeaming: 0,
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Users", null, {});
  },
};
