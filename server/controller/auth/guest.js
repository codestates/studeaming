const { User } = require("../../models");
const { sendAccessToken } = require("../functions/token");
const usernameGenerator = require("../functions/usernameGenerator");
const { setDefault, dropData } = require("../functions/model");

module.exports = async (req, res) => {
  try {
    const username = await usernameGenerator("게스트");

    const guest = await User.create({
      username: username,
      isEmailVerified: true,
    });

    await setDefault(guest.id);
    sendAccessToken(res, { id: guest.id });

    setTimeout(async () => {
      await dropData(guest.id);
    }, 60 * 60 * 1000);

    res.send({ user: { id: guest.id, username: username } });
  } catch (e) {
    res.status(500).send(e);
  }
};
