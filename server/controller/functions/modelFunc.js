const { User, Studylog } = require("../../models");
const { Op } = require("sequelize");

module.exports = {
  verifyUsername: async (username) => {
    try {
      const user = await User.findOne({
        where: { username },
      });

      if (!user && username) {
        return false;
      } else {
        return true;
      }
    } catch (err) {
      return null;
    }
  },
  verifyEmail: async (email) => {
    try {
      const user = await User.findOne({
        where: { email },
      });

      if (!user && email) {
        return false;
      } else {
        return true;
      }
    } catch (err) {
      return null;
    }
  },
  getStudyTime: async (studyLogList) => {
    return studyLogList.reduce((acc, currentLog) => {
      return (
        acc + currentLog.finishedAt.getTime() - currentLog.startedAt.getTime()
      );
    }, 0);
  },
  getStudyLogs: async (id, start, end) => {
    const studyLogList = await Studylog.findAll({
      where: {
        user_id: id,
        finishedAt: { [Op.gte]: start },
        startedAt: { [Op.lte]: end },
      },
      raw: true,
    });

    studyLogList.forEach((log) => {
      if (log.startedAt < start) {
        log.startedAt = start;
      }
      if (log.finishedAt === null) {
        log.finishedAt = new Date();
      } else if (log.finishedAt > end) {
        log.finishedAt = end;
      }
    }); //각 배열 요소들의 startedAt(start보다 전이라면 start)부터 finishedAt(null이라면 현재시간, end보다 뒤라면 end)까지

    return studyLogList;
  },
};
