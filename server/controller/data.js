const { User } = require("../models");
const { getStudyTime, getStudyLogs } = require("./functions/modelFunc");
const { isAccessAuthorized } = require("./functions/tokenFunc");

module.exports = {
  getStudyData: async (req, res) => {
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
};
