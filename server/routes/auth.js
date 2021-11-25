const express = require("express");
const router = express.Router();
const {
  signup,
  signin,
  checkAvailability,
  signout,
  withdraw,
} = require("../controller/auth");
const { googleSignin, kakaoSignin } = require("../controller/oauth");

router.post("/signup", signup);
router.post("/signup/availability", checkAvailability);
router.post("/signin", signin);
router.post("/signout", signout);
router.delete("/withdraw", withdraw);
router.post("/oauth/google", googleSignin);
router.post("/oauth/kakao", kakaoSignin);

module.exports = router;
