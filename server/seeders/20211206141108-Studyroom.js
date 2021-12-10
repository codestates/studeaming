"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      "Studyrooms",
      [
        {
          user_id: 0,
          uuid: "fakeuuid1",
          title: "벽난로 소리와 함께 공부하기",
          thumbnail:
            "https://images.unsplash.com/photo-1543393470-b2c833b98dce?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8ZmlyZXBsYWNlfGVufDB8fDB8fA%3D%3D&w=1000&q=80",
          headCount: 0,
        },
        {
          user_id: 0,
          uuid: "fakeuuid2",
          title: "빗소리 들으며 공부하기",
          thumbnail:
            "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.pexels.com%2Fphoto%2Fwater-rainy-rain-raindrops-110874%2F&psig=AOvVaw3ZWXSKyXNnXG_56cCJwvu5&ust=1639225932623000&source=images&cd=vfe&ved=0CAsQjRxqFwoTCLDlptGe2fQCFQAAAAAdAAAAABAD",
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
