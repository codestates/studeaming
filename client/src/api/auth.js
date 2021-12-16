import api from "./index";

const authAPI = {
  signup: (userInfo) => {
    return api.post(`/auth/signup`, userInfo, {
      header: { "content-type": "multipart/form-data" },
    });
  },

  checkAvailability: (type, input) => {
    let payload;
    switch (type) {
      case "email":
        payload = { email: input };
        break;
      case "username":
        payload = { username: input };
        break;
      default:
        payload = {};
    }
    return api.post(`auth/signup/availability`, { type, ...payload });
  },

  signin: (email, password) => {
    return api.post(`/auth/signin`, { email, password });
  },

  guestSignin: () => {
    return api.post(`auth/signin/guest`);
  },

  signout: () => {
    return api.post(`/auth/signout`);
  },

  withdraw: (password) => {
    return api.delete(`/auth/withdraw`, { data: { password } });
  },

  googleOAuth: (googlecode) => {
    return api.post(`auth/oauth/google`, { googlecode });
  },

  kakaoOAuth: (kakaocode) => {
    return api.post(`auth/oauth/kakao`, { kakaocode });
  },

  verification: (code) => {
    return api.post(`/verification/${code}`);
  },
};

export default authAPI;
