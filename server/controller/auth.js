const { User, Currentlog } = require("../models");
const encryptPassword = require("./functions/encryptFunctions");
const {
  sendAccessToken,
  sendRefreshToken,
  clearToken,
  isRefreshAuthorized,
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

          if (created) {
            const defautToggle = await Currentlog.create({
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
                sendAccessToken(res, { id: user.id });
                sendRefreshToken(res, { id: user.id });
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

  checkAvailability: async (req, res) => {
    if (req.body.type === "email" && req.body.email) {
      try {
        const user = await User.findOne({ where: { email: req.body.email } });
        if (!user) {
          res.send({ message: "Available" });
        } else {
          res.status(409).send({ message: "Already exist" });
        }
      } catch {
        res.sendStatus(500);
      }
    } else if (req.body.type === "username" && req.body.username) {
      try {
        const user = await User.findOne({
          where: { username: req.body.username },
        });
        if (!user) {
          res.send({ message: "Available" });
        } else {
          res.status(409).send({ message: "Already exist" });
        }
      } catch {
        res.sendStatus(500);
      }
    } else {
      res.status(400).send({ message: "Invalid parameter" });
    }
  },

  signout: (req, res) => {
    try {
      clearToken(res);
      res.sendStatus(205);
    } catch {
      res.sendStatus(500);
    }
  },

  withdraw: (req, res) => {
    //todo: drop data
    if (req.password) {
    } else {
    }
  },

  refreshToken: (req, res) => {
    try {
      const data = isRefreshAuthorized(req);
      if (data) {
        clearToken(res);
        sendAccessToken(res, data);
      } else {
        res.status(401).send({ message: "Invalid refresh token" });
      }
    } catch {
      res.sendStatus(500);
    }
  },
};
