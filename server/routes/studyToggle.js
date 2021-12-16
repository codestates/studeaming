const express = require("express");
const checkAuth = require("../middleware/checkAuth");
const { studyToggle } = require("../controller");
const router = express.Router();

router.get("/", checkAuth, studyToggle.get);
router.post("/", checkAuth, studyToggle.post);
router.delete("/:id", checkAuth, studyToggle.delete);

module.exports = router;
