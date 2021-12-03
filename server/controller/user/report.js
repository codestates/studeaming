const { User } = require("../../models");
const { getStudyTime, getStudyLogs } = require("../functions/model");
const { isAccessAuthorized } = require("../functions/token");

module.exports = {
  getReport: async (req, res) => {
    try {
      const id = isAccessAuthorized(req).id;
      const now = Math.round(Date.now() / (60 * 1000));

      const studyLogs = await getStudyLogs(id, 0, now);
      const studyTime = await getStudyTime(studyLogs);

      const user = await User.findOne({ where: { id }, raw: true });

      res.send({ studyTime: studyTime, studeamingTime: user.studeaming });
    } catch (e) {
      res.status(500).send(e);
    }
  },

  getMonthlyReport: async (req, res) => {
    try {
      const id = isAccessAuthorized(req).id;
      const year = req.query.year || new Date().getFullYear();
      const month = req.query.month || new Date().getMonth();
      const offset = req.query.offset || 0;

      const utc = Number(offset) + Date.UTC(year, month - 1, 1) / (1000 * 60);

      let dateStart = Math.round(utc);
      let dateEnd = dateStart + 60 * 24 * 28;

      while (new Date(dateEnd * 60 * 1000).getMonth() + 1 === Number(month)) {
        dateEnd += 60 * 24;
      }

      const studyLogs = await getStudyLogs(id, dateStart, dateEnd);
      const monthlyReport = [];

      while (dateStart < dateEnd) {
        monthlyReport.push(
          await getStudyTime(studyLogs, dateStart, dateStart + 60 * 24)
        );
        dateStart += 60 * 24;
      }

      res.send({ year: year, month: month, report: monthlyReport });
    } catch (e) {
      res.status(500).send(e);
    }
  },
};
