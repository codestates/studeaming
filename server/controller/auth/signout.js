const { clearToken, isAccessAuthorized } = require("../functions/token");
const { toggleOff } = require("../functions/model");

module.exports = async (req, res) => {
  try {
    const id = isAccessAuthorized(req).id;

    await toggleOff(id);

    clearToken(res);

    res.sendStatus(205);
  } catch {
    res.sendStatus(500);
  }
};
