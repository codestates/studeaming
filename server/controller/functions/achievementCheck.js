const { User, user_achievement, Studylog } = require("../../models");
const { getStudyTime, getStudyLogs } = require("./model");

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
    const isAchieved = await haveAchievement(id, 1);
    if (isAchieved) return;

    try {
      await user_achievement.findOrCreate({
        where: { user_id: id, achievement_id: 1 },
      });
      return;
    } catch (e) {
      return;
    }
  },
  //스터디밍 켤 때 호출
  startStudeaming: async (id) => {
    const isAchieved = await haveAchievement(id, 2);
    if (isAchieved) return;

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
    const isAchieved = await haveAchievement(id, 3);
    if (isAchieved) return;

    try {
      const logs = await Studylog.findAll({
        where: { user_id: id },
        raw: true,
      });
      const studyTime = await getStudyTime(logs);

      if (studyTime >= 100 * 60) {
        await user_achievement.findOrCreate({
          where: { user_id: id, achievement_id: 3 },
        });
      }

      return;
    } catch (e) {
      return;
    }
  },
  //스터디밍 끌 때 호출
  studeamHundredhours: async (id) => {
    const isAchieved = await haveAchievement(id, 4);
    if (isAchieved) return;

    try {
      const user = await User.findOne({ where: { id: id }, raw: true });

      if (user.studeaming > 100 * 60) {
        await user_achievement.findOrCreate({
          where: { user_id: id, achievement_id: 4 },
        });
      }

      return;
    } catch (e) {
      return;
    }
  },
  //스터디밍 방에서 나올 때 호출
  watchHundredhours: async (id) => {
    const isAchieved = await haveAchievement(id, 5);
    if (isAchieved) return;

    try {
      const user = await User.findOne({ where: { id: id }, raw: true });

      if (user.watching > 100 * 60) {
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
    const isAchieved = await haveAchievement(id, 6);
    if (isAchieved) return;

    try {
      const logs = await getStudyLogs(
        id,
        Date.now() / (60 * 1000) - 24 * 60,
        Date.now() / (60 * 1000)
      );

      const studyTime = await getStudyTime(logs);

      if (studyTime > 24 * 60) {
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
    const isAchieved = await haveAchievement(id, 7);
    if (isAchieved) return;

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
  //매주 월요일에 실행
  spendPerfectWeek: async () => {
    try {
      const today = Date.now() / (60 * 1000);
      const aWeekAgo = today - 7 * 24 * 60;

      const users = await User.findOne({ raw: true, attributes: ["id"] });

      users.map(async (user) => {
        const isAchieved = await haveAchievement(user.id, 8);
        if (isAchieved) return;

        let day = today;
        const studylogs = await getStudyLogs(user.id, aWeekAgo, today);

        while (day > aWeekAgo) {
          let studyTime = await getStudyTime(studylogs, day - 24 * 60, day);

          if (studyTime < 4 * 60) return;
          day -= 24 * 60;
        }

        await user_achievement.findOrCreate({
          where: { user_id: user.id, achievement_id: 8 },
        });

        return;
      });

      return;
    } catch (e) {
      return;
    }
  },
  //휴식 토글 끌 때(patch studylog)
  successSecretMission: async (id) => {
    const isAchieved = await haveAchievement(id, 9);
    if (isAchieved) return;

    try {
      const restLogs = await Studylog.findAll({
        where: { user_id: id, name: "휴식" },
        raw: true,
      });
      const restTime = await getStudyTime(restLogs);

      if (restTime > 10 * 60) {
        await user_achievement.findOrCreate({
          where: { user_id: id, achievement_id: 9 },
        });
      }

      return;
    } catch (e) {
      return;
    }
  },
};
