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
          startedAt: new Date("2021-11-29T21:20:00").getTime() / (1000 * 60),
          finishedAt: new Date("2021-11-29T21:50:00").getTime() / (1000 * 60),
        },
        {
          user_id: 1,
          name: "전자기학",
          color: "#ffaeae",
          startedAt: new Date("2021-11-29T21:50:00").getTime() / (1000 * 60),
          finishedAt: new Date("2021-11-30T01:00:00").getTime() / (1000 * 60),
        },
        {
          user_id: 1,
          name: "회로이론",
          color: "#b4e29e",
          startedAt: new Date("2021-11-30T01:00:00").getTime() / (1000 * 60),
          finishedAt: new Date("2021-11-30T05:30:00").getTime() / (1000 * 60),
        },
        {
          user_id: 1,
          name: "전자기학",
          color: "#ffaeae",
          startedAt: new Date("2021-11-30T07:00:00").getTime() / (1000 * 60),
          finishedAt: new Date("2021-11-30T10:20:00").getTime() / (1000 * 60),
        },
        {
          user_id: 1,
          name: "전자기학",
          color: "#ffaeae",
          startedAt: new Date("2021-11-31T07:00:00").getTime() / (1000 * 60),
          finishedAt: new Date("2021-12-01T10:20:00").getTime() / (1000 * 60),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Studylogs", null, {});
  },
};
