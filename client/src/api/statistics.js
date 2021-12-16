import api from "./index";

const statisticsAPI = {
  getTotalTime: () => {
    return api.get(`user/report`);
  },

  getMonthlyReport: (year, month, offset) => {
    return api.get(
      `user/monthly_report?year=${year}&month=${month}&offset=${offset}`
    );
  },
};

export default statisticsAPI;
