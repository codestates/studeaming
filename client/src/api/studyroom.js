import api from "./index";

const studyroomAPI = {
  getStudyRoom: () => {
    return api.get(`/studyroom`);
  },
  postStudyRoom: (roomInfo) => {
    return api.post(`/studyroom`, roomInfo, {
      header: { "content-type": "multipart/form-data" },
    });
  },
};

export default studyroomAPI;
