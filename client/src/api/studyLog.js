import api from "./index";

const logAPI = {
  getLogs: async (data) => {
    return await api.get(`/studylog/${date}`);
  },

  initiateLog: async (name, color) => {
    return await api.post(`/studylog`, { name, color });
  },

  finishLog: async (name, color) => {
    return await api.patch(`/studylog`, { name, color });
  },

  getComment: async (date) => {
    return await api.get(`/studylog/comment/${date}`);
  },

  modifyComment: async (date, comment) => {
    return await api.patch(`/studylog/comment/${date}`, { comment });
  },
};

export default logAPI;
