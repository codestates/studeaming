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
      expiresIn: "1h",
    });
    res.cookie("authorization", accessToken, cookieOpt);
  },
  sendRefreshToken: (res, data) => {
    const refreshToken = sign(data, process.env.REFRESH_SECRET, {
      expiresIn: "100h",
    });
    console.log("refresh token", refreshToken);
    res.cookie("refresh", refreshToken, {
      ...cookieOpt,
      Path: "/auth/token",
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
    res.clearCookie("authorization", { domain: process.env.CLIENT_DOMAIN });
    res.clearCookie("refresh", {
      domain: process.env.CLIENT_DOMAIN,
      path: "/auth/refresh",
    });
  },
};
