"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      "user_achievements",
      [
        {
          user_id: 1,
          achievement_id: 1,
        },
        {
          user_id: 1,
          achievement_id: 2,
        },
        {
          user_id: 2,
          achievement_id: 1,
        },
        {
          user_id: 2,
          achievement_id: 2,
        },
        {
          user_id: 2,
          achievement_id: 4,
        },
        {
          user_id: 2,
          achievement_id: 6,
        },
        {
          user_id: 3,
          achievement_id: 1,
        },
        {
          user_id: 3,
          achievement_id: 2,
        },
        {
          user_id: 3,
          achievement_id: 4,
        },
        {
          user_id: 3,
          achievement_id: 6,
        },
        {
          user_id: 4,
          achievement_id: 1,
        },
        {
          user_id: 4,
          achievement_id: 2,
        },
        {
          user_id: 4,
          achievement_id: 3,
        },
        {
          user_id: 4,
          achievement_id: 8,
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("user_achievements", null, {});
  },
};
