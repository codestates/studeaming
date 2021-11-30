"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      "Studylogs",
      [
        {
          user_id: 1,
          name: "휴식",
          color: "#a5c7e5",
          startedAt: new Date("2021-11-29T13:20:00"),
          finishedAt: new Date("2021-11-29T13:50:00"),
        },
        {
          user_id: 1,
          name: "전자기학",
          color: "#ffaeae",
          startedAt: new Date("2021-11-29T13:50:00"),
          finishedAt: new Date("2021-11-29T16:00:00"),
        },
        {
          user_id: 1,
          name: "회로이론",
          color: "#b4e29e",
          startedAt: new Date("2021-11-29T16:00:00"),
          finishedAt: new Date("2021-11-29T18:30:00"),
        },
        {
          user_id: 1,
          name: "전자기학",
          color: "#ffaeae",
          startedAt: new Date("2021-11-29T22:00:00"),
          finishedAt: new Date("2021-11-30T01:20:00"),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Studylogs", null, {});
  },
};
