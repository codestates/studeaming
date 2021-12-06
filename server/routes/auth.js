const express = require("express");
const checkAuth = require("../middleware/checkAuth");
const router = express.Router();

const {
  signup,
  signin,
  guest,
  checkAvailability,
  signout,
  withdraw,
  refreshToken,
  googleSignin,
  kakaoSignin,
} = require("../controller");

router.post("/signup", signup);
router.post("/signup/availability", checkAvailability);
router.post("/signin", signin);
router.post("/signin/guest", guest);
router.post("/signout", signout);
router.delete("/withdraw", checkAuth, withdraw);
router.post("/oauth/google", googleSignin);
router.post("/oauth/kakao", kakaoSignin);
router.post("/token", refreshToken);

module.exports = router;
