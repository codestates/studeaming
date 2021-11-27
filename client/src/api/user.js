import api from "./index";

const userAPI = {
  getUserInfo: async () => {
    return await api.get(`/user`);
  },

  modifyUserInfo: async (editInfo) => {
    return await api.patch(`/user`, editInfo);
  },

  modifyPassword: async (currentPassword, newPassword) => {
    return await api.patch(`/user/password`, { currentPassword, newPassword });
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
