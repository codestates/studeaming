const path = require("path");
const multer = require("multer");
const multerS3 = require("multer-s3");
const aws = require("aws-sdk");

aws.config.loadFromPath(__dirname + "/awsconfig.json");
const s3 = new aws.S3();

module.exports = (req, res, next) => {
  let storage = multerS3({
    s3: s3,
    bucket: "studeaming-images",
    acl: "public-read",
    key: function (req, file, cb) {
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
