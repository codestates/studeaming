const { User, Currentlog } = require("../models");
const encryptPassword = require("./functions/encryptFunc");
const {
  sendAccessToken,
  sendRefreshToken,
  clearToken,
  isRefreshAuthorized,
  isAccessAuthorized,
} = require("./functions/tokenFunc");
const {
  generateVerification,
  sendVerifyEmail,
} = require("./functions/emailVerifyFunc");
const {
  verifyUsername,
  verifyEmail,
  dropData,
  toggleOff,
} = require("./functions/modelFunc");

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
          where: { email: req.body.email, platformType: "original" },
          raw: true,
        });
        if (user) {
          encryptPassword.decrypt(
            res,
            req.body.password,
            user.password,
            (result) => {
              if (user.isEmailVerified) {
                sendAccessToken(res, { id: user.id });
                sendRefreshToken(res, { id: user.id });
                res.send({
                  user: {
                    id: user.id,
                    email: user.email,
                    username: user.username,
                    platformType: user.platformType,
                  },
                });
              } else {
                res
                  .status(401)
                  .send({ message: "Verify email address", email: user.email });
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
    const { type, email, username } = req.body;

    if (type === "email" && email) {
      if (verifyEmail(email)) {
        res.send({ message: "Available" });
      } else {
        res.status(409).send({ message: "Already exist" });
      }
    } else if (type === "username" && username) {
      if (verifyUsername(username)) {
        res.send({ message: "Available" });
      } else {
        res.status(409).send({ message: "Already exist" });
      }
    } else {
      res.status(400).send({ message: "Invalid parameter" });
    }
  },

  signout: async (req, res) => {
    try {
      const id = isAccessAuthorized(req).id;

      await toggleOff(id);

      clearToken(res);

      res.sendStatus(205);
    } catch {
      res.sendStatus(500);
    }
  },

  withdraw: async (req, res) => {
    try {
      const id = isAccessAuthorized(req).id;

      const user = await User.findByPk(id);

      encryptPassword.decrypt(
        res,
        req.body.password,
        user.password,
        async (result) => {
          await dropData(user.id);
          clearToken(res);
          res.sendStatus(204);
        }
      );
    } catch (e) {
      res.status(500).send(e);
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
