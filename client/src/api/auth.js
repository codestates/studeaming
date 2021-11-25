import api from "./index";

const authAPI = {
  signup: async (username, email, password) => {
    return await api.post(`/auth/signup`, { username, email, password });
  },

  // check email availability
  // check username availability

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
};

export default authAPI;
