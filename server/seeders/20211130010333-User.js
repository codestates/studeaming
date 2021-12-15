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
          about: "안녕하세요, 코딩을 좋아하는 김코딩입니다.",
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
          about: "공부하러 왔다가 물만 먹고 갑니다.",
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
          about: "멍멍멍멍멍멍",
          createdAt: new Date(),
          updatedAt: new Date(),
          studeaming: 0,
        },
        {
          username: "김콜론",
          password:
            "$2b$10$UVVoof14GBtep.xOHkMFGOroatfwJNMIgv8VNIFd2j.BTZyDCkVV6",
          email: "semi@colon.com",
          isEmailVerified: true,
          platformType: "original",
          about: "안녕하세요 ;입니다.",
          createdAt: new Date(),
          updatedAt: new Date(),
          studeaming: 263,
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Users", null, {});
  },
};
