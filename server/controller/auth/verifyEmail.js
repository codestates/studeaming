const { User } = require("../../models");

module.exports = async (req, res) => {
  const emailVerifyCode = req.params.emailVerifyCode;
  if (emailVerifyCode) {
    try {
      const verified = await User.update(
        { isEmailVerified: true, emailVerifyCode: null },
        { where: { emailVerifyCode } }
      );
      if (verified[0]) {
        res.send({ message: "Verified" });
      } else {
        res.send({ message: "Wrong verification code" }); //todo: status code
      }
    } catch {
      res.sendStatus(500);
    }
  } else {
    res.sendStatus(404);
  }
};
