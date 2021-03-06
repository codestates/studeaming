const {
  User,
  Studylog,
  Currentlog,
  user_achievement,
  user_follower,
  Comment,
} = require("../../models");
const { Op } = require("sequelize");

module.exports = {
  verifyUsername: async (username) => {
    try {
      const user = await User.findOne({
        where: { username },
      });

      if (!user) {
        return true;
      } else {
        return false;
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

      if (!user) {
        return true;
      } else {
        return false;
      }
    } catch (err) {
      return null;
    }
  },

  setDefault: async (id) => {
    try {
      await Currentlog.create({
        user_id: id,
        name: "휴식",
      });
    } catch {
      return null;
    }
  },

  getStudyTime: async (studylogList, start, end) => {
    return studylogList
      .filter((log) => log.name !== "휴식")
      .reduce((acc, cur) => {
        if (
          (start === undefined && end === undefined) ||
          (cur.startedAt > start && cur.finishedAt < end)
        ) {
          return acc + cur.finishedAt - cur.startedAt;
        } else if (
          (cur.startedAt < start && cur.finishedAt < start) ||
          (cur.startedAt > end && cur.finishedAt > end)
        ) {
          return acc;
        } else if (cur.startedAt < start && cur.finishedAt > end) {
          return acc + end - start;
        } else if (cur.startedAt < start) {
          return acc + cur.finishedAt - start;
        } else {
          return acc + end - cur.startedAt;
        }
      }, 0);
  },

  getStudylogs: async (id, start, end) => {
    const studylogList = await Studylog.findAll({
      where: {
        user_id: id,

        finishedAt: { [Op.or]: { [Op.gte]: start, [Op.is]: null } },
        startedAt: { [Op.lte]: end },
      },
      raw: true,
    });

    studylogList.forEach((log) => {
      if (log.startedAt < start) {
        log.startedAt = start;
      }
      if (log.finishedAt === null) {
        log.finishedAt = Math.round(Date.now() / (60 * 1000));
      } else if (log.finishedAt > end) {
        log.finishedAt = end;
      }
    });

    return studylogList;
  },

  toggleOff: async (id) => {
    await Studylog.update(
      //이전 로그 중 끝나지 않은 항목이 있는지 우선 확인하고, 있다면 업데이트
      { finishedAt: Date.now() / (60 * 1000) },
      {
        where: { user_id: id, finishedAt: { [Op.is]: null } },
      }
    );

    await Currentlog.update(
      //현재 토글 isOn 상태 바꾸기
      { isOn: false },
      { where: { user_id: id } }
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
      await Comment.destroy({ where: { user_id: id } });
    } catch (e) {}
  },
};
