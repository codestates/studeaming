const express = require("express");
const router = express.Router();
const verifyEmail = require("../controller/auth/verifyEmail");

router.post("/:emailVerifyCode", verifyEmail);

module.exports = router;
