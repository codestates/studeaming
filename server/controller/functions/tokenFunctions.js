const { sign, verify } = require("jsonwebtoken");
require("dotenv").config();

module.exports = {
  generateToken: (data) => {},
  sendToken: (res, accessToken) => {},
  isAuthorized: (req) => {},
  clearToken: (res) => {},
};
