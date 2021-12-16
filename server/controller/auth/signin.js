const { User } = require("../../models");
const encryptPassword = require("../functions/encryption");
const { sendAccessToken, sendRefreshToken } = require("../functions/token");

module.exports = async (req, res) => {
  if (req.body.email && req.body.password) {
    try {
      const user = await User.findOne({
        where: { email: req.body.email, platformType: "original" },
        raw: true,
      });
      if (user) {
        encryptPassword.decrypt(res, req.body.password, user.password, () => {
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
        });
      } else {
        res.status(401).send({ message: "Wrong email or password" });
      }
    } catch {
      res.sendStatus(500);
    }
  } else {
    res.sendStatus(500);
  }
};
