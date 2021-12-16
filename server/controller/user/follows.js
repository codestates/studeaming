const { User, user_follower } = require("../../models");
const { isAccessAuthorized } = require("../functions/token");
const checkAchievement = require("../functions/achievementCheck");

module.exports = {
  get: async (req, res) => {
    try {
      const user_id = isAccessAuthorized(req).id;

      const studeamerIdList = await user_follower.findAll({
        where: { user_id },
        raw: true,
      });
      console.log(studeamerIdList);

      const studeamerList = await User.findAll({
        where: {
          id: studeamerIdList.map((obj) => obj.studeamer_id),
        },
        attributes: ["username", "profileImg"],
        raw: true,
      });

      res.send({ studeamerList: studeamerList });
    } catch (e) {
      res.status(500).send(e);
    }
  },

  post: async (req, res) => {
    try {
      const user = isAccessAuthorized(req);
      const username = req.params.username;

      const studeamer = await User.findOne({
        where: { username },
        attributes: ["id", "username", "profileImg"],
        raw: true,
      });

      await user_follower.findOrCreate({
        where: { user_id: user.id, studeamer_id: studeamer.id },
      });

      checkAchievement.haveTenFollowers(studeamer.id);

      res.send({ newFollow: studeamer });
    } catch (e) {
      res.status(500).send(e);
    }
  },

  delete: async (req, res) => {
    try {
      const user_id = isAccessAuthorized(req).id;
      const username = req.params.username;
      const studeamer = await User.findOne({ where: { username }, raw: true });
      const studeamer_id = studeamer.id;

      await user_follower.destroy({ where: { user_id, studeamer_id } });

      res.sendStatus(204);
    } catch (e) {
      res.status(500).send(e);
    }
  },
};
