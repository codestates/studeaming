const express = require("express");
const router = express.Router();
const studyToggle = require("../controller/studyToggle");
const checkAuth = require("../middleware/checkAuth");

router.get("/", checkAuth, studyToggle.get);
router.post("/", checkAuth, studyToggle.post);
router.delete("/:id", checkAuth, studyToggle.delete);

module.exports = router;
