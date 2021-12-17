const { sign, verify } = require("jsonwebtoken");
require("dotenv").config();
const cookieOpt = {
  httpOnly: true,
  samesite: "None",
  secure: true,
  domain: process.env.COOKIE_DOMAIN,
};

module.exports = {
  sendAccessToken: (res, data) => {
    const accessToken = sign(data, process.env.ACCESS_SECRET, {
      expiresIn: "1h",
    });
    res.cookie("authorization", accessToken, { ...cookieOpt, path: "/" });
  },

  sendRefreshToken: (res, data) => {
    const refreshToken = sign(data, process.env.REFRESH_SECRET, {
      expiresIn: "7d",
    });
    res.cookie("refresh", refreshToken, {
      ...cookieOpt,
      path: "/auth/token",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
  },

  isAccessAuthorized: (req) => {
    const authorization = req.cookies["authorization"];
    if (!authorization) {
      return null;
    }
    try {
      return verify(authorization, process.env.ACCESS_SECRET);
    } catch (err) {
      return null;
    }
  },

  isRefreshAuthorized: (req) => {
    const refreshToken = req.cookies["refresh"];
    if (!refreshToken) {
      return null;
    }
    try {
      return verify(refreshToken, process.env.REFRESH_SECRET);
    } catch (err) {
      return null;
    }
  },

  clearToken: (res) => {
    res.clearCookie("authorization", {
      domain: process.env.COOKIE_DOMAIN,
      path: "/",
    });
    res.cookie("refresh", "", {
      ...cookieOpt,
      path: "/auth/token",
      maxAge: -1,
    });
  },
};
