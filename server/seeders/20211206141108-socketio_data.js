"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      "socketio_data",
      [
        {
          user_id: 1,
          uuid: "fakeuuid1",
          title: "같이 공부해요. 테스트용 방입니다",
          thumbnail: "http://tny.im/qIy",
          headCount: 1,
        },
        {
          user_id: 2,
          uuid: "fakeuuid2",
          title: "테스트 데이터입니다. 같이 말 안하고 코딩하실 분 있나요??",
          thumbnail: "http://tny.im/qIz",
          headCount: 2,
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("socketio_data", null, {});
  },
};
