const { sign, verify } = require("jsonwebtoken");
require("dotenv").config();
const cookieOpt = {
  httpOnly: true,
  //sameSite: "none",
  //secure: true, https 사용 시 활성화
  domain: process.env.CLIENT_DOMAIN,
};

module.exports = {
  sendAccessToken: (res, data) => {
    const accessToken = sign(data, process.env.ACCESS_SECRET, {
      expiresIn: "50m",
    });
    res.cookie("authorization", accessToken, cookieOpt);
  },
  sendRefreshToken: (res, data) => {
    const refreshToken = sign(data, process.env.REFRESH_SECRET, {
      expiresIn: "24h",
    });
    console.log("refresh token", refreshToken);
    res.cookie("refresh", refreshToken, {
      ...cookieOpt,
      path: "/auth/refresh",
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
    const refreshToken = req.cookies["refreshToken"];
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
    res.clearCookie("authorization", { domain: process.env.CLIENT_DOMAIN });
    res.clearCookie("refresh", {
      domain: process.env.CLIENT_DOMAIN,
      path: "/auth/refresh",
    });
  },
};
