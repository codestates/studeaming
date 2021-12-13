"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      "Studyrooms",
      [
        {
          user_id: 0,
          uuid: "0",
          title: "장작 타는 소리 들으며 공부하기",
          thumbnail:
            "https://images.unsplash.com/photo-1543393470-b2c833b98dce?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8ZmlyZXBsYWNlfGVufDB8fDB8fA%3D%3D&w=1000&q=80",
          headCount: 0,
        },
        {
          user_id: 0,
          uuid: "1",
          title: "시냇물 흐르는 소리 들으며 공부하기",
          thumbnail:
            "https://images.pexels.com/photos/315998/pexels-photo-315998.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
          headCount: 0,
        },
        {
          user_id: 0,
          uuid: "2",
          title: "밤 풍경소리 들으며 공부하기",
          thumbnail:
            "https://images.pexels.com/photos/631477/pexels-photo-631477.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
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
