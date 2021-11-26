const express = require("express");
const router = express.Router();
const {
  getUser,
  getProfile,
  getFollows,
  followUser,
  deleteFollow,
} = require("../controller/user");
const checkAuth = require("../middleware/checkAuth");

router.get("/", checkAuth, getUser);
router.get("/:username/profile", getProfile);
router.get("/follows", checkAuth, getFollows);
router.post("/follows/:username", checkAuth, followUser);
router.delete("/follows/:username", checkAuth, deleteFollow);

module.exports = router;
