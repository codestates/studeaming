const express = require("express");
const router = express.Router();
const {
  getUser,
  editUser,
  editPassword,
  getProfile,
  getFollows,
  followUser,
  deleteFollow,
} = require("../controller/user");
const { getMyAchieve, getOtherAchieve } = require("../controller/achievement");
const checkAuth = require("../middleware/checkAuth");

router.get("/", checkAuth, getUser);
router.patch("/", checkAuth, editUser);
router.patch("/password", checkAuth, editPassword);
router.get("/:username/profile", getProfile);
router.get("/follows", checkAuth, getFollows);
router.post("/follows/:username", checkAuth, followUser);
router.delete("/follows/:username", checkAuth, deleteFollow);
router.get("/achievement", checkAuth, getMyAchieve);
router.get("/:username/achievement", checkAuth, getOtherAchieve);

module.exports = router;
