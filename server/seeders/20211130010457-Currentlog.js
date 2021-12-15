"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      "Currentlogs",
      [
        {
          user_id: 1,
          name: "휴식",
          color: "yellow",
          isOn: false,
        },
        {
          user_id: 2,
          name: "휴식",
          color: "yellow",
          isOn: false,
        },
        {
          user_id: 3,
          name: "휴식",
          color: "yellow",
          isOn: false,
        },
        {
          user_id: 1,
          name: "전자기학",
          color: "red",
          isOn: false,
        },
        {
          user_id: 1,
          name: "회로이론",
          color: "green",
          isOn: false,
        },
        {
          user_id: 1,
          name: "한국사",
          color: "purple",
          isOn: false,
        },
        {
          user_id: 4,
          name: "휴식",
          color: "yellow",
          isOn: false,
        },
        { user_id: 4, name: "전자기학", color: "green", isOn: false },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Currentlogs", null, {});
  },
};
