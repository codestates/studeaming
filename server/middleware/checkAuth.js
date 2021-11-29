const { isAccessAuthorized } = require("../controller/functions/tokenFunc");

module.exports = (req, res, next) => {
  const user = isAccessAuthorized(req);

  if (!user) {
    res.status(401).send({ message: "Invalid access token" });
  } else {
    next();
  }
};
