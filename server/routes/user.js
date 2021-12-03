const express = require("express");
const checkAuth = require("../middleware/checkAuth");
const router = express.Router();

const {
  userInfo,
  profile,
  follows,
  achievement,
  report,
} = require("../controller");

router.get("/", checkAuth, userInfo.getUser);
router.patch("/", checkAuth, userInfo.editUser);
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
