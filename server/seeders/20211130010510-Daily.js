"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      "Dailies",
      [
        {
          user_id: 1,
          date: new Date("2021-11-29"),
          comment:
            "회로 강의를 오늘 다 끝내서 저녁에 조금 쉬었다! 내일부터 2회독 시작해야지",
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Dailies", null, {});
  },
};
