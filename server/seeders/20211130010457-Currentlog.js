"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      "Currentlogs",
      [
        {
          user_id: 1,
          name: "휴식",
          color: "#a5c7e5",
          isOn: false,
        },
        {
          user_id: 2,
          name: "휴식",
          color: "#a5c7e5",
          isOn: false,
        },
        {
          user_id: 3,
          name: "휴식",
          color: "#a5c7e5",
          isOn: false,
        },
        {
          user_id: 1,
          name: "전자기학",
          color: "#ffaeae",
          isOn: false,
        },
        {
          user_id: 1,
          name: "회로이론",
          color: "#b4e29e",
          isOn: false,
        },
        {
          user_id: 1,
          name: "한국사",
          color: "#a5c7e5",
          isOn: false,
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Currentlogs", null, {});
  },
};
