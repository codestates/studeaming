const express = require("express");
const { studyRoom } = require("../controller");
const uploadImage = require("../middleware/uploadImage");
const checkAuth = require("../middleware/checkAuth");
const router = express.Router();

router.get("/", studyRoom.get);
router.post("/", checkAuth, uploadImage, studyRoom.post);

module.exports = router;
