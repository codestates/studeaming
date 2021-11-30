const { User } = require("../models");
const { sendAccessToken, sendRefreshToken } = require("./functions/tokenFunc");
const generateName = require("./functions/generateUsername");
const {
  getKakaoToken,
  getGoogleToken,
  getGoogleEmail,
  getKakaoEmail,
} = require("./functions/OAuthFunc");

module.exports = {
  googleSignin: async (req, res) => {
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
  },
  kakaoSignin: async (req, res) => {
    try {
      const accessToken = await getKakaoToken(req.body.code); // todo:응답 객체 확인
      const data = await getKakaoEmail(accessToken);

      if (data) {
        const email = data.kakao_account.email;
        const { nickname, profile_image_url } = data.kakao_account.profile;
        const username = generateName(nickname);

        const [user, created] = await User.findOrCreate({
          where: { email: email, platformType: "kakao" },
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
  },
};
