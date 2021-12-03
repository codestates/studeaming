const bcrypt = require("bcrypt");
const saltRounds = 10;

module.exports = {
  encrypt: (res, myPlaintextPassword, cb) => {
    bcrypt.hash(myPlaintextPassword, saltRounds, function (err, hash) {
      if (err) {
        res.status(500).send();
      } else {
        cb(hash);
      }
    });
  },
  decrypt: (res, myPlaintextPassword, hash, cb) => {
    bcrypt.compare(myPlaintextPassword, hash, function (err, result) {
      if (err) {
        res.status(500).send();
      } else if (!result) {
        res.status(401).send({ message: "Wrong password" });
      } else {
        cb(result);
      }
    });
  },
};
