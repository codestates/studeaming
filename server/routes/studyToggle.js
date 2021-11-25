const express = require("express");
const router = express.Router();
const studyToggle = require("../controller/studyToggle");

router.get("/", studyToggle.get);
router.post("/", studyToggle.post);
router.delete("/:id", studyToggle.delete);

module.exports = router;
