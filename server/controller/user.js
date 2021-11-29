const { Op } = require("sequelize");
const { User, Currentlog, user_follower } = require("../models");
const { isAccessAuthorized } = require("./functions/tokenFunc");
const { verifyUsername, getStudyTime } = require("./functions/modelFunc");
const { encrypt, decrypt } = require("./functions/encryptFunc");

module.exports = {
  getUser: async (req, res) => {
    try {
      const id = isAccessAuthorized(req).id;

      const user = await User.findOne({
        where: { id },
        attributes: [
          "id",
          "username",
          "email",
          "profileImg",
          "about",
          "studeaming",
        ],
        raw: true,
      });

      if (user) {
        res.send({ user: user });
      } else {
        res.status(401).send({ message: "Invalid access token" });
      }
    } catch (e) {
      res.status(500).send(e);
    }
  },

  editUser: async (req, res) => {
    try {
      const id = isAccessAuthorized(req).id;

      if (!req.body.username || verifyUsername(req.body.username)) {
        const user = await User.findOne({ where: { id }, raw: true });

        const profileImg = req.body.profileImg || user.profileImg;
        const username = req.body.username || user.username;
        const about = req.body.about || user.about;
        console.log(profileImg, username, about);
        await User.update({ profileImg, username, about }, { where: { id } });

        res.status(200).send({
          user: {
            id: user.id,
            email: user.email,
            username: username,
            profileImg: profileImg,
            about: about,
            studeaming: user.studeaming,
          },
          message: "Modified",
        });
      } else {
        res.status(409).send({ message: "Username already exists" });
      }
    } catch (e) {
      res.status(500).send(e);
    }
  },

  editPassword: async (req, res) => {
    try {
      const id = isAccessAuthorized(req).id;
      const { currentPassword, newPassword } = req.body;
      const user = await User.findOne({ where: { id }, raw: true });

      decrypt(res, currentPassword, user.password, () => {
        encrypt(res, newPassword, async (hash) => {
          await User.update({ password: hash }, { where: { id } });
          res.send({ message: "Password updated" }); //todo:gitbook
        });
      });
    } catch (e) {
      res.status(500).send(e);
    }
  },

  getProfile: async (req, res) => {
    const username = req.params.username;

    try {
      const user = await User.findOne({
        where: { username },
        attributes: ["id", "username", "profileImg", "about"],
        raw: true,
      });

      const currentlogs = await Currentlog.findAll({
        where: { user_id: user.id, name: { [Op.ne]: "휴식" } },
        attributes: ["name"],
        raw: true,
      });

      const now = new Date();
      const aMonthAgo = new Date(new Date().setDate(now.getDate() - 30));

      const studyTime = await getStudyTime(user.id, aMonthAgo, now);

      res.send({
        profile: {
          ...user,
          studylogList: currentlogs.map((obj) => obj.name),
          studyTime: studyTime,
        },
      });
    } catch (e) {
      res.status(500).send(e);
    }
  },

  getFollows: async (req, res) => {
    try {
      const user_id = isAccessAuthorized(req).id;

      const studeamerIdList = await user_follower.findAll({
        where: { user_id },
        raw: true,
      });
      console.log(studeamerIdList);

      const studeamerList = await User.findAll({
        where: {
          id: studeamerIdList.map((obj) => obj.studeamer_id), //todo: 빈 배열일 때 오류 없이 반환되는지 테스트
        },
        attributes: ["username", "profileImg"],
        raw: true,
      });

      res.send({ studeamerList: studeamerList });
    } catch (e) {
      res.status(500).send(e);
    }
  },

  followUser: async (req, res) => {
    try {
      const user = isAccessAuthorized(req);
      const username = req.params.username;

      const studeamer = await User.findOne({
        where: { username },
        attributes: ["id", "username", "profileImg"],
        raw: true,
      });
      console.log(studeamer);
      await user_follower.findOrCreate({
        where: { user_id: user.id, studeamer_id: studeamer.id },
      });

      res.send({ newFollow: studeamer });
    } catch (e) {
      res.status(500).send(e);
    }
  },

  deleteFollow: async (req, res) => {
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
