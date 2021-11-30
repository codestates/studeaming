import api from "./index";

const userAPI = {
  getUserInfo: () => {
    return api.get(`/user`);
  },

  modifyUserInfo: (editInfo) => {
    return api.patch(`/user`, editInfo);
  },

  modifyPassword: (currentPassword, newPassword) => {
    return api.patch(`/user/password`, { currentPassword, newPassword });
  },

  getOthersInfo: (username) => {
    return api.get(`/user/${username}/profile`);
  },

  getFollows: () => {
    return api.get(`user/follows`);
  },

  follow: (username) => {
    return api.post(`user/follows/${username}`);
  },

  unfollow: (username) => {
    return api.delete(`user/follows/${username}`);
  },

  getAchievement: () => {
    return api.get(`user/achievement`);
  },

  getOthersAchievement: (username) => {
    return api.get(`user/${username}/achievement`);
  },
};

export default userAPI;
