const { User } = require("../../models");
const encryptPassword = require("../functions/encryption");
const { clearToken, isAccessAuthorized } = require("../functions/token");
const { dropData } = require("../functions/model");
const { disconnectKakao } = require("../functions/OAuth");

module.exports = async (req, res) => {
  try {
    const id = isAccessAuthorized(req).id;

    const user = await User.findByPk(id, { raw: true });

    switch (user.platformType) {
      case "google":
        await dropData(user.id);
        clearToken(res);
        res.sendStatus(204);

        break;

      case "kakao":
        const kakaoId = await disconnectKakao(user.authCode);
        if (kakaoId) {
          await dropData(user.id);
          clearToken(res);
          res.sendStatus(204);
        } else {
          res.sendStatus(500);
        }

        break;

      case "original":
        encryptPassword.decrypt(
          res,
          req.body.password,
          user.password,
          async () => {
            await dropData(user.id);
            clearToken(res);
            res.sendStatus(204);
          }
        );

        break;

      default:
        await dropData(user.id);
        clearToken(res);
        res.sendStatus(204);
    }
  } catch (e) {
    res.status(500).send(e);
  }
};
