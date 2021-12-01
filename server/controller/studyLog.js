const { Studylog } = require("../models");
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
      const { name, color } = req.body;

      await toggleOff(user.id);

      const newLog = await Studylog.create({
        user_id: user.id,
        name: name,
        color: color,
        startedAt: Date.now() / (60 * 1000),
      });
      console.log(Date.now());

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
      const { name, color } = req.body; //토글 이름과 색상을 받아 끝나는 시간이 비어 있는 최근 레코드를 업데이트한다

      const logToUpdate = await Studylog.findOne({
        //업데이트할 로그의 아이디를 우선 조회
        where: {
          user_id: user.id,
          name: name,
          color: color,
          finishedAt: { [Op.is]: null },
        },
        raw: true,
      });

      const updated = await Studylog.update(
        //아이디에 해당하는 로그 끝나는 시간을 현재 시간으로 업데이트
        { finishedAt: Date.now() / (60 * 1000) },
        { where: { id: logToUpdate.id } }
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
            finishedAt: logToUpdate.finishedAt,
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
