"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      "Comments",
      [
        {
          user_id: 1,
          date: new Date("2021-11-29"),
          comment:
            "회로 강의를 오늘 다 끝내서 저녁에 조금 쉬었다! 내일부터 2회독 시작해야지",
        },
        {
          user_id: 4,
          date: new Date("2021-12-15"),
          comment:
            "드디어 종강 D-2!! 왜 나만 금요일 종강이냐구~ 그래도 끝까지 힘내본다..🔥 전자기학 뿌셔!",
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Comments", null, {});
  },
};
