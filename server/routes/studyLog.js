const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/checkAuth");

const { updateStudylog, getStudylog, comment } = require("../controller");

router.post("/", checkAuth, updateStudylog.post);
router.patch("/", checkAuth, updateStudylog.patch);
router.get("/", checkAuth, getStudylog);
router.get("/comment/:date", checkAuth, comment.get);
router.patch("/comment/:date", checkAuth, comment.patch);

module.exports = router;
