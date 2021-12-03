const { User, Currentlog } = require("../../models");
const encryptPassword = require("../functions/encryption");

const {
  generateVerification,
  sendVerifyEmail,
} = require("../functions/emailVerification");

module.exports = async (req, res) => {
  if (req.body.username && req.body.password && req.body.email) {
    encryptPassword.encrypt(res, req.body.password, async (hash) => {
      try {
        const [newUser, created] = await User.findOrCreate({
          where: { username: req.body.username },
          defaults: {
            email: req.body.email,
            isEmailVerified: false,
            password: hash,
            platformType: "original",
          },
          raw: true,
        });

        if (created) {
          await Currentlog.create({
            user_id: newUser.id,
            name: "휴식",
          });
          const code = await generateVerification(newUser.id);
          sendVerifyEmail(newUser.email, code);
          res.send({
            user: {
              id: newUser.id,
              email: newUser.email,
              username: newUser.username,
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