const express = require("express");
const { getStudyroom } = require("../controller");
const router = express.Router();

router.get("/", getStudyroom);

module.exports = router;
