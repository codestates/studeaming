const { User } = require("../../models");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
require("dotenv").config();

module.exports = {
  // 인증 코드 생성
  generateVerification: async (id) => {
    const head = crypto.randomBytes(256).toString("hex").substr(100, 5);
    const tail = crypto.randomBytes(256).toString("base64").substr(50, 5);
    const emailVerifyCode = head + tail + id.toString();
    try {
      await User.update({ emailVerifyCode }, { where: { id } });

      setTimeout(async () => {
        const user = await User.findOne({ where: { id }, raw: true });
        if (!user.isEmailVerified) {
          await User.destroy({ where: { id } });
        }
      }, 60 * 60 * 1000);

      return emailVerifyCode;
    } catch {}
  },

  sendVerifyEmail: async (email, code) => {
    const url = process.env.CLIENT_URL + "/auth?code=" + code.toString();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.NODEMAILER_EMAIL,
        pass: process.env.NODEMAILER_PASSWORD,
      },
    });
    try {
      await transporter.sendMail({
        from: `${process.env.NODEMAILER_EMAIL}`,
        to: email,
        subject: "Studeamer 인증 메일",
        html: "<div>이메일을 인증하려면 URL을 클릭해주세요.</div><br>" + url, //todo: html design
      });
    } catch {
      //todo: handle error
    }
  },
};
