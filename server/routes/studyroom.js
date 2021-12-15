const express = require("express");
const { studyRoom } = require("../controller");
const uploadImage = require("../middleware/uploadImage");
const router = express.Router();

router.get("/", studyRoom.get);
router.post("/", uploadImage, studyRoom.post);

module.exports = router;
