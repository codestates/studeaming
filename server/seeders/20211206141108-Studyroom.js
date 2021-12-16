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
        {
          user_id: 3,
          uuid: "fakeuuid1",
          title: "장작 소리 들으며 집중력 불태우기 🔥 | 대학원생 스터디윗미",
          thumbnail: "https://i.imgur.com/N5pYFqY.jpg?1",
          headCount: 1,
        },
        {
          user_id: 2,
          uuid: "fakeuuid2",
          title:
            "study with me | 집에서 따로 또 같이 공부해요 | 대학생, 백색소음",
          thumbnail: "https://i.imgur.com/4vtXF2G.png?2",
          headCount: 1,
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Studyrooms", null, {});
  },
};
