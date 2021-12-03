const { User } = require("../../models");
const encryptPassword = require("../functions/encryption");
const { clearToken, isAccessAuthorized } = require("../functions/token");
const { dropData } = require("../functions/model");

module.exports = async (req, res) => {
  try {
    const id = isAccessAuthorized(req).id;

    const user = await User.findByPk(id);

    encryptPassword.decrypt(res, req.body.password, user.password, async () => {
      await dropData(user.id);
      clearToken(res);
      res.sendStatus(204);
    });
  } catch (e) {
    res.status(500).send(e);
  }
};
