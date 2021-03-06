module.exports = {
  signup: require("./auth/signup"),
  signin: require("./auth/signin"),
  guest: require("./auth/guest"),
  checkAvailability: require("./auth/checkAvailability"),
  signout: require("./auth/signout"),
  withdraw: require("./auth/withdraw"),
  refreshToken: require("./auth/refresh"),
  googleSignin: require("./oauth/googleSignin"),
  kakaoSignin: require("./oauth/kakaoSignin"),
  updateStudylog: require("./studylog/updateStudylog"),
  getStudylog: require("./studylog/getStudylog"),
  comment: require("./studylog/comment"),
  studyToggle: require("./studylog/studyToggle"),
  userInfo: require("./user/userInfo"),
  profile: require("./user/profile"),
  follows: require("./user/follows"),
  achievement: require("./user/achievement"),
  report: require("./user/report"),
  studyRoom: require("./studyRoom/studyroom"),
};
