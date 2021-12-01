import api from "./index";

const statisticsAPI = {
  getTotalTime: () => {
    return api.get(`user/data`);
  },
};

export default statisticsAPI;
