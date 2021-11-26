const { User } = require("../models");
const encryptPassword = require("./functions/encryptFunctions");
const {
  generateToken,
  sendToken,
  clearToken,
} = require("./functions/tokenFunctions");
const {
  generateVerification,
  sendVerifyEmail,
} = require("./functions/EmailVerifyFunctions");

module.exports = {
  signup: async (req, res) => {
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
          console.log(newUser.email);
          if (created) {
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
            res
              .status(409)
              .send({ message: "Email or username already exists" });
          }
        } catch {
          res.sendStatus(500);
        }
      });
    } else {
      res.sendStatus(500); //todo:add response for not enough parameter
    }
  },

  signin: async (req, res) => {
    if (req.body.email && req.body.password) {
      try {
        const user = await User.findOne({
          where: { email: req.body.email },
          raw: true,
        });
        if (user) {
          encryptPassword.decrypt(
            res,
            req.body.password,
            user.password,
            (result) => {
              if (result && user.isEmailVerified) {
                const accessToken = generateToken({ id: user.id });
                sendToken(res, accessToken);
                res.send({
                  user: {
                    id: user.id,
                    email: user.email,
                    username: user.username,
                  },
                });
              } else if (result) {
                res
                  .status(401)
                  .send({ message: "Verify email address", email: user.email });
              } else {
                res.status(401).send({ message: "Wrong email or password" });
              }
            }
          );
        } else {
          res.status(401).send({ message: "Wrong email or password" });
        }
      } catch {
        res.sendStatus(500);
      }
    } else {
      res.sendStatus(500);
    }
  },

  checkAvailability: (req, res) => {},

  signout: (req, res) => {
    clearToken(res);
    res.sendStatus(205);
  },

  withdraw: (req, res) => {
    if (req.password) {
    } else {
    }
  },
};
