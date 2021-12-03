const { User } = require("../../models");
const { sendAccessToken, sendRefreshToken } = require("../functions/token");
const generateName = require("../functions/usernameGenerator");
const { getKakaoToken, getKakaoEmail } = require("../functions/OAuth");

module.exports = async (req, res) => {
  try {
    const accessToken = await getKakaoToken(req.body.code); // todo:응답 객체 확인
    const data = await getKakaoEmail(accessToken);

    if (data) {
      const oauthId = data.id;
      const { nickname, profile_image_url } = data.kakao_account.profile;
      const username = generateName(nickname);

      const [user, created] = await User.findOrCreate({
        where: { authCode: oauthId, platformType: "kakao" },
        defaults: {
          profileImg: profile_image_url,
          username: username,
          isEmailVerified: true,
        },
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
