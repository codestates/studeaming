const express = require("express");
const router = express.Router();
const studyLog = require("../controller/studyLog");
const comment = require("../controller/comment");

router.post("/", studyLog.post);
router.patch("/", studyLog.patch);
router.get("/:date", studyLog.get);
router.get("/comment/:date", comment.get);
router.patch("/comment/:date", comment.patch);

module.exports = router;
