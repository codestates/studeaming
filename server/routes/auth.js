const express = require("express");
const checkAuth = require("../middleware/checkAuth");
const router = express.Router();

const {
  signup,
  signin,
  checkAvailability,
  signout,
  withdraw,
  refreshToken,
} = require("../controller/auth");
const { googleSignin, kakaoSignin } = require("../controller/oauth");

router.post("/signup", signup);
router.post("/signup/availability", checkAvailability);
router.post("/signin", signin);
router.post("/signout", signout);
router.delete("/withdraw", checkAuth, withdraw);
router.post("/oauth/google", googleSignin);
router.post("/oauth/kakao", kakaoSignin);
router.post("/token", refreshToken);

module.exports = router;
