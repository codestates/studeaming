const path = require("path");
const multer = require("multer");

module.exports = (req, res, next) => {
  let storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads/profile");
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}_${file.originalname}`);
    },
  });

  const upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
      const ext = path.extname(file.originalname);
      if (ext !== ".png" && ext !== ".jpg" && ext !== ".jpeg") {
        return cb(new Error("Only .png, .jpg and .jpeg format allowed!"));
      }
      cb(null, true);
    },
  }).single("profile_img");

  upload(req, res, (err) => {
    if (err) {
      res.status(500).send({ message: err.message });
    } else {
      next();
    }
  });
};
