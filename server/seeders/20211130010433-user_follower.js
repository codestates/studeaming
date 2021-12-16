"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      "user_followers",
      [
        {
          user_id: 3,
          studeamer_id: 1,
        },
        {
          user_id: 1,
          studeamer_id: 2,
        },
        {
          user_id: 4,
          studeamer_id: 1,
        },
        {
          user_id: 4,
          studeamer_id: 2,
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("user_followers", null, {});
  },
};
