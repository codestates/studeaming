const {
  sendAccessToken,
  clearToken,
  isRefreshAuthorized,
} = require("../functions/token");

module.exports = (req, res) => {
  try {
    const data = isRefreshAuthorized(req);
    if (data) {
      clearToken(res);
      sendAccessToken(res, { id: data.id });
      res.status(200).send({ message: "Access token reissued" });
    } else {
      res.status(401).send({ message: "Invalid refresh token" });
    }
  } catch {
    res.sendStatus(500);
  }
};
