const { Studylog, Currentlog } = require("../models");
const { isAccessAuthorized } = require("./functions/tokenFunc");
const {
  getStudyTime,
  getStudyLogs,
  toggleOff,
} = require("./functions/modelFunc");
const checkAchievement = require("./functions/checkAchievement");
const { Op } = require("sequelize");

module.exports = {
  post: async (req, res) => {
    try {
      const user = isAccessAuthorized(req);

      await toggleOff(user.id);

      const toggle = await Currentlog.findOne({
        where: { id: req.body.id, user_id: user.id },
        raw: true,
      });

      await Currentlog.update(
        { isOn: true },
        { where: { id: req.body.id, user_id: user.id } }
      );

      const newLog = await Studylog.create({
        user_id: user.id,
        name: toggle.name,
        color: toggle.color,
        startedAt: Math.round(Date.now() / (60 * 1000)),
      });

      if (newLog) {
        checkAchievement.startLog(user.id);
        res.send({ studylog: { id: newLog.id, startedAt: newLog.startedAt } });
      } else {
        res.sendStatus(500);
      }
    } catch (e) {
      res.status(500).send(e);
    }
  },

  patch: async (req, res) => {
    try {
      const user = isAccessAuthorized(req);

      const logToUpdate = await Studylog.findOne({
        //업데이트할 로그의 아이디를 우선 조회
        where: {
          user_id: user.id,
          finishedAt: { [Op.is]: null },
        },
        raw: true,
      });

      const updated = await Studylog.update(
        //아이디에 해당하는 로그 끝나는 시간을 현재 시간으로 업데이트
        { finishedAt: Date.now() / (60 * 1000) },
        { where: { finishedAt: { [Op.is]: null } } }
      );

      await Currentlog.update(
        { isOn: false },
        { where: { id: req.body.id, user_id: user.id } }
      );

      if (logToUpdate && updated) {
        if (logToUpdate.name === "휴식") {
          checkAchievement.successSecretMission(user.id);
        } else {
          checkAchievement.studyHundredhours(user.id);
          checkAchievement.studyHalfDay(user.id);
        }

        //요청받은 로그도 있고 업데이트도 성공했으면 성공 응답
        res.send({
          studylog: {
            id: logToUpdate.id,
            startedAt: logToUpdate.startedAt,
            finishedAt: Math.round(Date.now() / (60 * 1000)),
          },
        });
      } else {
        res.sendStatus(500);
      }
    } catch (e) {
      res.status(500).send(e);
    }
  },

  get: async (req, res) => {
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
      console.log("utc", utc);

      const dateStart = Math.round(utc);
      const dateEnd = dateStart + 24 * 60;

      console.log(dateStart);
      console.log(dateEnd);

      const studyLogList = await getStudyLogs(user.id, dateStart, dateEnd);
      const studyTime = await getStudyTime(studyLogList);

      res.send({
        studylogList: studyLogList,
        studyTime: studyTime,
      });
    } catch (e) {
      res.status(500).send(e);
    }
  },
};
