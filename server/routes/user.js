const express = require("express");
const checkAuth = require("../middleware/checkAuth");
const uploadImage = require("../middleware/uploadImage");
const {
  userInfo,
  profile,
  follows,
  achievement,
  report,
} = require("../controller");
const router = express.Router();

router.get("/", checkAuth, userInfo.getUser);
router.patch("/", checkAuth, uploadImage, userInfo.editUser);
router.patch("/password", checkAuth, userInfo.editPassword);
router.get("/:username/profile", profile);
router.get("/follows", checkAuth, follows.get);
router.post("/follows/:username", checkAuth, follows.post);
router.delete("/follows/:username", checkAuth, follows.delete);
router.get("/achievement", checkAuth, achievement.getMyAchieve);
router.get("/:username/achievement", achievement.getOtherAchieve);
router.get("/report", checkAuth, report.getReport);
router.get("/monthly_report", checkAuth, report.getMonthlyReport);

module.exports = router;
