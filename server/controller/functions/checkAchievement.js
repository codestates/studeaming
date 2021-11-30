const {
  User,
  Achievement,
  user_achievement,
  Studylog,
} = require("../../models");
const { getStudyTime, getStudyLogs } = require("./modelFunc");

const haveAchievement = async (user_id, achievement_id) => {
  try {
    const achievement = await user_achievement.findOne({
      where: { user_id, achievement_id },
    });
    if (achievement) return true;
    else return false;
  } catch (e) {
    return null;
  }
};

module.exports = {
  //토글 켤 때(post studylog)
  startLog: async (id) => {
    if (haveAchievement(id, 1)) return;

    try {
      await user_achievement.findOrCreate({
        where: { user_id: id, achievement_id: 1 },
      });
      return;
    } catch (e) {
      return;
    }
  },
  //스터디밍 켤 때 호출 - 호출 미완료
  startStudeaming: async (id) => {
    if (haveAchievement(id, 2)) return;

    try {
      await user_achievement.findOrCreate({
        where: { user_id: id, achievement_id: 2 },
      });
    } catch (e) {
      return;
    }
  },
  //토글 끌 때(patch studylog)
  studyHundredhours: async (id) => {
    if (haveAchievement(id, 3)) return;

    try {
      const logs = await Studylog.findOne({
        where: { user_id: id },
        raw: true,
      });
      const studyTime = await getStudyTime(logs);

      if (studyTime >= 100 * 60 * 60 * 1000) {
        await user_achievement.findOrCreate({
          where: { user_id: id, achievement_id: 3 },
        });
      }
      return;
    } catch (e) {
      return;
    }
  },
  //스터디밍 끌 때 호출 - 호출 미완료
  studeamHundredhours: async (id) => {
    if (haveAchievement(id, 4)) return;

    try {
      const user = await User.findOne({ where: { user_id: id }, raw: true });
      if (user.studeaming > 100 * 60 * 60 * 1000) {
        await user_achievement.findOrCreate({
          where: { user_id: id, achievement_id: 4 },
        });
      }
      return;
    } catch (e) {
      return;
    }
  },
  //스터디밍 방에서 나올 때 호출 - 호출 미완료
  watchHundredhours: async (id) => {
    if (haveAchievement(id, 5)) return;

    try {
      const user = await User.findOne({ where: { user_id: id }, raw: true });
      if (user.watching > 100 * 60 * 60 * 1000) {
        await user_achievement.findOrCreate({
          where: { user_id: id, achievement_id: 5 },
        });
      }
      return;
    } catch (e) {
      return;
    }
  },
  //토글 끌 때(patch studylog)
  studyHalfDay: async (id) => {
    if (haveAchievement(id, 6)) return;

    try {
      const dateStart = new Date(
        `${new Date().getFullYear()},${
          new Date().getMonth() + 1
        },${new Date().getDate()}`
      );
      const logs = await getStudyLogs(id, dateStart, new Date());
      const studyTime = await getStudyTime(logs);

      if (studyTime > 12 * 60 * 60 * 1000) {
        await user_achievement.findOrCreate({
          where: { user_id: id, achievement_id: 6 },
        });
      }
      return;
    } catch (e) {
      return;
    }
  },
  //팔로우 요청 시 호출(post user/follows)
  haveTenFollowers: async (id) => {
    if (haveAchievement(id, 7)) return;

    try {
      const followers = await user_followers.findAll({
        where: { studeamer_id: id },
        raw: true,
      });

      if (followers.length > 9) {
        await user_achievement.findOrCreate({
          where: { user_id: id, achievement_id: 7 },
        });
      }
      return;
    } catch (e) {
      return;
    }
  },
  //미완성
  spendPerfectWeek: async (id) => {
    if (haveAchievement(id, 8)) return;

    try {
    } catch (e) {
      return;
    }
  },
  //휴식 토글 끌 때(patch studylog)
  successSecretMission: async (id) => {
    if (haveAchievement(id, 9)) return;

    try {
      const restLogs = await Studylog.findOne({
        where: { user_id: id, name: "휴식" },
        raw: true,
      });
      const restTime = await getStudyTime(restLogs);

      if (restTime > 10 * 60 * 60 * 1000) {
        await user_achievement.findOrCreate({
          where: { user_id: id, achievement_id: 9 },
        });
      }
    } catch (e) {
      return;
    }
  },
};
