import api from "./index";

const logAPI = {
  getLogs: (date) => {
    return api.get(`/studylog/${date}`);
  },

  initiateLog: (name, color) => {
    return api.post(`/studylog`, { name, color });
  },

  finishLog: (name, color) => {
    return api.patch(`/studylog`, { name, color });
  },

  getComment: (date) => {
    return api.get(`/studylog/comment/${date}`);
  },

  modifyComment: (date, comment) => {
    return api.patch(`/studylog/comment/${date}`, { comment });
  },
};

export default logAPI;
