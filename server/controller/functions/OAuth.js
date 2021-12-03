const axios = require("axios");
require("dotenv").config();

module.exports = {
  getGoogleToken: async (code) => {
    try {
      const response = await axios({
        method: "POST",
        url: "https://oauth2.googleapis.com/token",
        headers: {
          "content-type": "application/x-www-form-urlencoded;charset=utf-8",
        },
        params: {
          code: code,
          client_id: process.env.GOOGLE_CLIENT_ID,
          client_secret: process.env.GOOGLE_CLIENT_SECRET,
          redirect_uri: process.env.REDIRECT_URI,
          grant_type: "authorization_code",
        },
      });

      return response.data.access_token;
    } catch (e) {
      return null;
    }
  },

  getKakaoToken: async (code) => {
    try {
      const response = await axios({
        method: "POST",
        url: "https://kauth.kakao.com/oauth/token",
        headers: {
          "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
        },
        params: {
          code: code,
          client_id: process.env.KAKAO_CLIENT_ID,
          redirect_uri: process.env.REDIRECT_URI,
          grant_type: "authorization_code",
        },
      });

      return response.data.access_token;
    } catch {
      return null;
    }
  },

  getGoogleSubId: async (accessToken) => {
    try {
      const data = await axios({
        method: "get",
        url: "https://www.googleapis.com/oauth2/v3/userinfo",
        headers: {
          accept: "application/json",
        },
        params: { access_token: accessToken },
      });

      return data.data;
    } catch {
      return null;
    }
  },

  getKakaoSubId: async (accessToken) => {
    try {
      const data = await axios({
        method: "post",
        url: "https://kapi.kakao.com/v2/user/me",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
        },
      });

      return data.data;
    } catch (e) {
      return null;
    }
  },
};
