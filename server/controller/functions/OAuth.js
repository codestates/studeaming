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
          redirect_uri: process.env.CLIENT_URL,
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
        method: "post",
        url: "https://kauth.kakao.com/oauth/token",
        headers: {
          "content-type": "application/x-www-form-urlencoded;charset=utf-8",
        },
        params: {
          code: code,
          client_id: process.env.KAKAO_CLIENT_ID,
          redirect_uri: process.env.CLIENT_URL,
          grant_type: "authorization_code",
        },
      });

      return response.data.access_token;
    } catch (e) {
      return null;
    }
  },

  getGoogleEmail: async (accessToken) => {
    try {
      const data = await axios({
        method: "get",
        url: "https://www.googleapis.com/oauth2/v2/userinfo.email",
        headers: {
          authorization: `token ${accessToken}`,
          accept: "application/json",
        },
      });

      return data.data;
    } catch {
      return null;
    }
  },

  getKakaoEmail: async (accessToken) => {
    try {
      const data = await axios({
        method: "post",
        url: "https://kauth.kakao.com/v2/user/me",
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
        //params: {property_keys=["kakao_account.email"]}
      });

      return data.data;
    } catch (e) {
      return null;
    }
  },

  disconnect: (id) => {},
};
