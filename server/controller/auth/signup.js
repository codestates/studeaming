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
    const profileImg = res.req.file
      ? `${process.env.SERVER_URL}/${res.req.file.path}`
      : null;
    encryptPassword.encrypt(res, req.body.password, async (hash) => {
      try {
        const [newUser, created] = await User.findOrCreate({
          where: { username: req.body.username },
          defaults: {
            email: req.body.email,
            isEmailVerified: false,
            password: hash,
            platformType: "original",
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
          res.status(409).send({ message: "Email or username already exists" });
        }
      } catch {
        res.sendStatus(500);
      }
    });
  } else {
    res.sendStatus(500); //todo:add response for not enough parameter
  }
};
