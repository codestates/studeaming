"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      "Studyrooms",
      [
        {
          user_id: 0,
          uuid: "fire",
          title: "장작 타는 소리 들으며 공부하기",
          thumbnail: "https://i.imgur.com/W2f5uHV.png",
          headCount: 0,
        },
        {
          user_id: 0,
          uuid: "stream",
          title: "시냇물 흐르는 소리 들으며 공부하기",
          thumbnail: "https://i.imgur.com/RebKol8.png",
          headCount: 0,
        },
        {
          user_id: 0,
          uuid: "night",
          title: "밤 풍경소리 들으며 공부하기",
          thumbnail: "https://i.imgur.com/nw0Om7O.png",
          headCount: 0,
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Studyrooms", null, {});
  },
};
