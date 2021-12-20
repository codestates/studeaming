const { User } = require("../../models");
const encryptPassword = require("../functions/encryption");
require("dotenv").config();

const {
  generateVerification,
  sendVerifyEmail,
} = require("../functions/emailVerification");

const { setDefault } = require("../functions/model");

module.exports = async (req, res) => {
  if (req.body.username && req.body.password && req.body.email) {
    console.log(res.req.file);
    const profileImg = res.req.file ? res.req.file.location : null;
    encryptPassword.encrypt(res, req.body.password, async (hash) => {
      try {
        const [newUser, created] = await User.findOrCreate({
          where: {
            platformType: "original",
            email: req.body.email,
          },
          defaults: {
            username: req.body.username,
            isEmailVerified: false,
            password: hash,
            profileImg: profileImg,
          },
          raw: true,
        });

        if (created) {
          await setDefault(newUser.id);

          const code = await generateVerification(newUser.id);
          sendVerifyEmail(newUser.email, code);

          res.send({
            user: {
              id: newUser.id,
              email: newUser.email,
              username: newUser.username,
              profileImg: newUser.profileImg,
            },
          });
        } else {
          res.status(409).send({ message: "Email already exists" });
        }
      } catch (e) {
        res.status(500).send({ message: e.message });
      }
    });
  } else {
    res.sendStatus(500); //todo:add response for not enough parameter
  }
};
