import api from "./index";

const logAPI = {
  getLogs: (date, offset) => {
    return api.get(`/studylog?date=${date}&offset=${offset}`);
  },

  initiateLog: (id) => {
    return api.post(`/studylog`, { id });
  },

  finishLog: (id) => {
    return api.patch(`/studylog`, { id });
  },

  getComment: (date) => {
    return api.get(`/studylog/comment/${date}`);
  },

  modifyComment: (date, comment) => {
    return api.patch(`/studylog/comment/${date}`, { comment });
  },
};

export default logAPI;
