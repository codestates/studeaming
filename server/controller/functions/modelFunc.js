const {
  User,
  Studylog,
  Currentlog,
  user_achievement,
  user_follower,
  Daily,
} = require("../../models");
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

        finishedAt: { [Op.or]: { [Op.gte]: start, [Op.is]: null } },
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

  toggleOff: async (id) => {
    await Studylog.update(
      //이전 로그 중 끝나지 않은 항목이 있는지 우선 확인하고, 있다면 업데이트
      { finishedAt: new Date() },
      {
        where: { user_id: id, finishedAt: { [Op.is]: null } },
      }
    );
  },

  dropData: async (id) => {
    try {
      await User.destroy({ where: { id } });
      await Studylog.destroy({ where: { user_id: id } });
      await Currentlog.destroy({ where: { user_id: id } });
      await user_achievement.destroy({ where: { user_id: id } });
      await user_follower.destroy({
        where: { [Op.or]: [{ user_id: id }, { studeamer_id: id }] },
      });
      await Daily.destroy({ where: { user_id: id } });
    } catch (e) {}
  },
};
