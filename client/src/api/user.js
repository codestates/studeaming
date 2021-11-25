import api from "./index";

const userAPI = {
  getUserInfo: async () => {
    return await api.get(`/user`);
  },

  modifyUserInfo: async (type, newInfo) => {
    // 보완 필요
    let payload;
    switch (type) {
      case "profileImg":
        payload = { profileImg: newInfo };
      case "username":
        payload = { username: newInfo };
      case "about":
        payload = { about: newInfo };
      case "password":
        payload = { password: newInfo };
    }
    return await api.patch(`/user`, payload);
  },

  getOthersInfo: async (username) => {
    return await api.get(`/user/${username}/profile`);
  },

  getFollows: async () => {
    return await api.get(`user/follows`);
  },

  follow: async (username) => {
    return await api.post(`user/follows/${username}`);
  },

  unfollow: async (username) => {
    return await api.delete(`user/follows/${username}`);
  },
};

export default userAPI;
