const express = require("express");
const router = express.Router();
const verifyEmail = require("../controller/verifyEmail");

router.get("/:emailVerifyCode", verifyEmail);

module.exports = router;
