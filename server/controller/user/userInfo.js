const { User } = require("../../models");
const { isAccessAuthorized } = require("../functions/token");
const { verifyUsername } = require("../functions/model");
const { encrypt, decrypt } = require("../functions/encryption");
require("dotenv").config();

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

        const username = req.body.username || user.username;
        const about = req.body.about || user.about;
        const profileImg = res.req.file
          ? `${process.env.SERVER_URL}/${res.req.file.path}`
          : user.profileImg;

        await User.update({ username, about, profileImg }, { where: { id } });

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
};
