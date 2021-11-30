const { Achievement, user_achievement, User } = require("../models");
const { isAccessAuthorized } = require("./functions/tokenFunc");

module.exports = {
  getMyAchieve: async (req, res) => {
    try {
      const user = isAccessAuthorized(req);

      const achievements = await Achievement.findAll({
        order: [["id", "ASC"]],
        raw: true,
      });

      const achieveInfo = await user_achievement.findAll({
        order: [["achievement_id", "ASC"]],
        where: { user_id: user.id },
        raw: true,
      });

      const list = achievements.map((achievement) => {
        return { ...achievement, isGet: false };
      });

      achieveInfo.forEach((info) => {
        list[info.achievement_id - 1].isGet = true;
      });

      res.send({ achievements: list });
    } catch (e) {
      res.status(500).send(e);
    }
  },
  getOtherAchieve: async (req, res) => {
    try {
      const username = req.params.username;

      const user = await User.findOne({ where: { username } });

      const achievements = await Achievement.findAll({
        order: [["id", "ASC"]],
        raw: true,
      });

      const achieveInfo = await user_achievement.findAll({
        order: [["achievement_id", "ASC"]],
        where: { user_id: user.id },
        raw: true,
      });

      const list = achievements.map((achievement) => {
        return { ...achievement, isGet: false };
      });

      achieveInfo.forEach((info) => {
        list[info.achievement_id - 1].isGet = true;
      });

      res.send({ achievements: list });
    } catch (e) {
      res.status(500).send(e);
    }
  },
};
