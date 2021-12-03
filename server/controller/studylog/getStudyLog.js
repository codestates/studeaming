const { isAccessAuthorized } = require("../functions/token");
const { getStudyTime, getStudyLogs } = require("../functions/model");

module.exports = async (req, res) => {
  try {
    const user = isAccessAuthorized(req);
    const date =
      req.query.date ||
      new Date().getFullYear() +
        new Date().getMonth() +
        new Date().getDate() +
        "";
    const offset = req.query.offset || 0;

    const utc =
      Number(offset) +
      Date.UTC(
        date.slice(0, 4),
        Number(date.slice(4, 6)) - 1,
        Number(date.slice(6, 8))
      ) /
        (1000 * 60);

    const dateStart = Math.round(utc);
    const dateEnd = dateStart + 24 * 60;

    const studyLogList = await getStudyLogs(user.id, dateStart, dateEnd);
    const studyTime = await getStudyTime(studyLogList);

    res.send({
      studylogList: studyLogList,
      studyTime: studyTime,
    });
  } catch (e) {
    res.status(500).send(e);
  }
};
