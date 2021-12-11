const { User } = require("../../models");
const { sendAccessToken, sendRefreshToken } = require("../functions/token");
const { setDefault } = require("../functions/model");
const generateName = require("../functions/usernameGenerator");
const { getKakaoToken, getKakaoSubId } = require("../functions/OAuth");

module.exports = async (req, res) => {
  try {
    const accessToken = await getKakaoToken(req.body.kakaocode);
    if (accessToken) {
      const data = await getKakaoSubId(accessToken);

      if (data) {
        const subId = data.id;
        const nickname = data.kakao_account.profile_nickname_needs_agreement
          ? data.kakao_account.profile.nickname
          : undefined;
        const profile_image_url = data.kakao_account
          .profile_image_needs_agreement
          ? data.kakao_account.profile.profile_image_url
          : "";

        const username = await generateName(nickname);

        const [user, created] = await User.findOrCreate({
          where: { authCode: subId, platformType: "kakao" },
          defaults: {
            profileImg: profile_image_url,
            username: username,
            isEmailVerified: true,
          },
          raw: true,
        });

        await setDefault(user.id);

        sendAccessToken(res, { id: user.id });
        sendRefreshToken(res, { id: user.id });

        res.send({ id: user.id, username: user.username });
      } else {
        res.sendStatus(500);
      }
    } else {
      res.status(401).send({ message: "Invalid authorization code" });
    }
  } catch {
    res.sendStatus(500);
  }
};
