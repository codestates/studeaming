const express = require("express");
const verifyEmail = require("../controller/auth/verifyEmail");
const router = express.Router();

router.post("/:emailVerifyCode", verifyEmail);

module.exports = router;
