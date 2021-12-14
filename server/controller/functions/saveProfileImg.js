const multer = require("multer");

let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

let upload = multer({ storage: storage }).single("profile_img");

module.exports = {
  findProfile: (req, res) => {
    upload(req, res, (err) => {
      if (err) {
        return res.json({ success: false, err });
      }
      return res.json({
        success: true,
        image: res.req.file.path,
        fileName: res.req.file.filename,
      });
    });
  },
};
