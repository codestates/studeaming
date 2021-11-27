import api from "./index";

const authAPI = {
  signup: async (image, username, email, password) => {
    return await api.post(`/auth/signup`, { image, username, email, password });
  },

  checkAvailability: async (type, input) => {
    let payload;
    switch (type) {
      case "email":
        payload = { email: input };
      case "username":
        payload = { username: input };
    }
    return await api.post(`auth/signup/availability`, { type, ...payload });
  },

  signin: async (email, password) => {
    return await api.post(`/auth/signin`, { email, password });
  },

  signout: async () => {
    return await api.post(`/auth/logout`);
  },

  withdraw: async (password) => {
    return await api.delete(`/auth/withdraw`, { data: { password } });
  },

  googleOAuth: async (googlecode) => {
    return await api.post(`auth/oauth/google`, { googlecode });
  },

  kakaoOAuth: async (kakaocode) => {
    return await api.post(`auth/oauth/kakao`, { kakaocode });
  },

  verification: async (code) => {
    return await api.post(`/verification/${code}`);
  },
};

export default authAPI;
