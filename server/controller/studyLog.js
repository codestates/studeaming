const { Studylog, Daily } = require("../models");
const { isAccessAuthorized } = require("./functions/tokenFunc");
const { getStudyTime, getStudyLogs } = require("./functions/modelFunc");
const checkAchievement = require("./functions/checkAchievement");
const { Op } = require("sequelize");

module.exports = {
  post: async (req, res) => {
    try {
      const user = isAccessAuthorized(req);
      const { name, color } = req.body;

      await Studylog.update(
        //이전 로그 중 끝나지 않은 항목이 있는지 우선 확인하고, 있다면 업데이트
        { finishedAt: new Date() },
        {
          where: { user_id: user.id, finishedAt: { [Op.is]: null } },
        }
      );

      const newLog = await Studylog.create({
        //요청받은 새 로그 만들기
        user_id: user.id,
        name: name,
        color: color,
        startedAt: new Date(),
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
        { finishedAt: new Date() },
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
      const dateEnd = new Date(
        req.params.date.slice(0, 4),
        Number(req.params.date.slice(4, 6)) - 1,
        Number(req.params.date.slice(6, 8)) + 1
      );
      console.log(dateEnd);
      const dateStart = new Date(dateEnd - 24 * 60 * 60 * 1000);
      console.log(dateStart);

      const studyLogList = await getStudyLogs(user.id, dateStart, dateEnd);
      const studyTime = await getStudyTime(studyLogList);

      const [daily, created] = await Daily.findOrCreate({
        where: { user_id: user.id, date: dateStart },
        defaults: { comment: "" },
        raw: true,
      });

      res.send({
        studylogList: studyLogList,
        studyTime: studyTime,
        comment: daily.comment,
      }); //todo:comment 필요한가?
    } catch (e) {
      res.status(500).send(e);
    }
  },
};
