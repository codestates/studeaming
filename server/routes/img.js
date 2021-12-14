const express = require("express");
const fs = require("fs");
const router = express.Router();
const { findProfile } = require("../controller/functions/saveProfileImg");

fs.readdir("uploads", (error) => {
  if (error) {
    fs.mkdirSync("uploads");
  }
});

//todo: ROUTER
router.post("/", findProfile);

module.exports = router;
