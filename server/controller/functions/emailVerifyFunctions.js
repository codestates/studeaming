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
    await User.update({ emailVerifyCode }, { where: { id } });
    //todo: destroy if not verified after 1h
    return emailVerifyCode;
  },
  sendVerifyEmail: async (email, code) => {
    console.log(code);
    const url = process.env.SERVER_URL + "/verification/" + code.toString(); //todo: use client url

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
