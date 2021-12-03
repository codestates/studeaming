const { User } = require("../../models");
const { sendAccessToken, sendRefreshToken } = require("../functions/token");
const generateName = require("../functions/usernameGenerator");
const { getGoogleToken, getGoogleSubId } = require("../functions/OAuth");

module.exports = async (req, res) => {
  try {
    const accessToken = await getGoogleToken(req.body.googlecode);

    if (accessToken) {
      const data = await getGoogleSubId(accessToken);

      if (data) {
        const email = data.email;
        const username = await generateName(data.name);
        const subId = data.sub;

        const [user, created] = await User.findOrCreate({
          where: { authCode: subId, platformType: "google" },
          defaults: { username: username, isEmailVerified: true, email: email },
          raw: true,
        });

        sendAccessToken(res, { id: user.id });
        sendRefreshToken(res, { id: user.id });

        res.send({ id: user.id, username: user.username });
      } else {
        res.sendStatus(500);
      }
    } else {
      res.status(401).send({ message: "Invalid authorization code" });
    }
  } catch (e) {
    res.status(500).send(e);
  }
};
