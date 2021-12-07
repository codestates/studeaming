import api from "./index";

const studyroomAPI = {
  getStudyRoom: () => {
    return api.get(`/studyroom`);
  },
};

export default studyroomAPI;
