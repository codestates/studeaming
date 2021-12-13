const { User } = require("../../models");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
require("dotenv").config();

module.exports = {
  // 인증 코드 생성
  generateVerification: async (id) => {
    const head = crypto.randomBytes(256).toString("hex").substr(100, 6);
    const tail = crypto.randomBytes(256).toString("base64").substr(50, 6);
    const code = head + tail + id.toString();
    const verifyCode = code.split("/").reduce((acc, cur) => acc + cur);

    try {
      await User.update({ verifyCode }, { where: { id } });

      setTimeout(async () => {
        const user = await User.findOne({ where: { id }, raw: true });

        if (!user.isEmailVerified) {
          await User.destroy({ where: { id } });
        }
      }, 60 * 60 * 1000);

      return verifyCode;
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
        html:
          "<h3>Studeaming 이메일 인증</h3><br /><p>안녕하세요 Studeaming입니다. 아래 링크를 눌러 이메일 인증을 완료해주세요.</p><a target=_blank href=" +
          url +
          ">이메일 인증</a><p>링크는 발송 후 1시간 동안 유효합니다.</p>",
      });
    } catch {
      //todo: handle error
    }
  },
};
