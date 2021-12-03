const { User } = require("../../models");
const { sendAccessToken, sendRefreshToken } = require("../functions/token");
const generateName = require("../functions/usernameGenerator");
const { getGoogleToken, getGoogleEmail } = require("../functions/OAuth");

module.exports = async (req, res) => {
  try {
    //todo:인증 실패 시 응답
    const accessToken = await getGoogleToken(req.body.code); // todo:응답 객체 확인
    const data = await getGoogleEmail(accessToken);

    //todo:응답 객체 확인 email, name
    //todo:구글 인증 오류 처리
    if (data) {
      const email = data.email;
      const username = generateName(data.name);

      const [user, created] = await User.findOrCreate({
        where: { email: email, platformType: "google" },
        defaults: { username: username, isEmailVerified: true },
        raw: true,
      });

      sendAccessToken(res, { id: user.id });
      sendRefreshToken(res, { id: user.id });
    } else {
      res.sendStatus(500);
    }
  } catch {
    res.sendStatus(500);
  }
};
