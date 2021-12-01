const express = require("express");
const router = express.Router();
const studyLog = require("../controller/studyLog");
const comment = require("../controller/comment");
const checkAuth = require("../middleware/checkAuth");

router.post("/", checkAuth, studyLog.post);
router.patch("/", checkAuth, studyLog.patch);
router.get("/", checkAuth, studyLog.get);
router.get("/comment/:date", checkAuth, comment.get);
router.patch("/comment/:date", checkAuth, comment.patch);

module.exports = router;
