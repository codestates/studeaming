const express = require("express");
const router = express.Router();
const {
  getUser,
  getProfile,
  getFollows,
  followUser,
  deleteFollow,
} = require("../controller/user");

router.get("/", getUser);
router.get("/:username/profile", getProfile);
router.get("/follows", getFollows);
router.post("/follows/:username", followUser);
router.delete("/follows/:username", deleteFollow);

module.exports = router;
