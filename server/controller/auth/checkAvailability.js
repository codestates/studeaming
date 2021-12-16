const { verifyUsername, verifyEmail } = require("../functions/model");

module.exports = async (req, res) => {
  const { type, email, username } = req.body;

  if (type === "email" && email) {
    const available = await verifyEmail(email);
    if (available) {
      res.send({ message: "Available" });
    } else {
      res.status(409).send({ message: "Already exist" });
    }
  } else if (type === "username" && username) {
    const available = await verifyUsername(username);
    if (available) {
      res.send({ message: "Available" });
    } else {
      res.status(409).send({ message: "Already exist" });
    }
  } else {
    res.status(400).send({ message: "Invalid parameter" });
  }
};
