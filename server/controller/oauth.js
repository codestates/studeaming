const { User } = require("../models");
const axios = require("axios");
const {
  sendAccessToken,
  sendRefreshToken,
} = require("./functions/tokenFunctions");
const generateName = require("./functions/generateUsername");
require("dotenv").config();

module.exports = {
  googleSignin: async (req, res) => {
    try {
      //todo:인증 실패 시 응답
      const response = await axios({
        method: "get",
        url: "https://oauth2.googleapis.com/token",
        params: {
          code: req.body.code,
          client_id: process.env.GOOGLE_CLIENT_ID,
          client_secret: process.env.GOOGLE_CLIENT_SECRET,
          redirect_uri: process.env.CLIENT_URL,
          grant_type: "authorization_code",
        },
      });

      const accessToken = response.data.access_token; // todo:응답 객체 확인

      const data = await axios({
        method: "get",
        url: "https://www.googleapis.com/oauth2/v2/userinfo.email",
        headers: {
          authorization: `token ${accessToken}`,
          accept: "application/json",
        },
      });

      //todo:응답 객체 확인 email, name
      //todo:구글 인증 오류 처리
      const email = data.data.email;
      const username = generateName(data.data.name);

      const [user, created] = await User.findOrCreate({
        where: { email: email, platformType: "google" },
        defaults: { username: username, isEmailVerified: true },
        raw: true,
      });

      sendAccessToken(res, { id: user.id });
      sendRefreshToken(res, { id: user.id });
    } catch {
      res.sendStatus(500);
    }
  },
  kakaoSignin: (req, res) => {
    try {
      const response = await axios({
        method: "post",
        url: "https://kauth.kakao.com/oauth/token",
        params: {
          code: req.body.code,
          client_id: process.env.KAKAO_CLIENT_ID,
          redirect_uri: process.env.CLIENT_URL,
          grant_type: "authorization_code",
        },
      });

      const accessToken = response.data.access_token;

      const data = await axios({
        method: "post",
        url: "https://kauth.kakao.com/v2/user/me",
        headers: {
          authorization: `Bearer ${accessToken}`,
          accept: "application/x-www-form-urlencoded;charset=utf-8",
        },
        //params: {property_keys=["kakao_account.email"]}
      });

      const email = data.data.kakao_account.email;
      const { nickname, profile_image_url } = data.data.kakao_account.profile;
      const username = generateName(nickname);

      if (email) {
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
        //todo:사용자가 이메일 정보를 허용하지 않음
      }
    } catch {
      res.sendStatus(500);
    }
  },
};
