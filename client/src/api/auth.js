import api from "./index";

const authAPI = {
  signup: (image, username, email, password) => {
    return api.post(`/auth/signup`, { image, username, email, password });
  },

  checkAvailability: (type, input) => {
    let payload;
    switch (type) {
      case "email":
        payload = { email: input };
      case "username":
        payload = { username: input };
    }
    return api.post(`auth/signup/availability`, { type, ...payload });
  },

  signin: (email, password) => {
    return api.post(`/auth/signin`, { email, password });
  },

  signout: () => {
    return api.post(`/auth/logout`);
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
