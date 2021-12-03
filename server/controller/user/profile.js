const { Op } = require("sequelize");
const { User, Currentlog } = require("../../models");
const { getStudyTime, getStudyLogs } = require("../functions/model");

module.exports = async (req, res) => {
  const username = req.params.username;

  try {
    const user = await User.findOne({
      where: { username },
      attributes: ["id", "username", "profileImg", "about"],
      raw: true,
    });

    const currentlogs = await Currentlog.findAll({
      where: { user_id: user.id, name: { [Op.ne]: "휴식" } },
      attributes: ["name"],
      raw: true,
    });

    const now = new Date();
    const aMonthAgo = new Date(new Date().setDate(now.getDate() - 30));

    const studyLogs = await getStudyLogs(user.id, aMonthAgo, now);
    const studyTime = await getStudyTime(studyLogs);

    res.send({
      profile: {
        ...user,
        studylogList: currentlogs.map((obj) => obj.name),
        studyTime: studyTime,
      },
    });
  } catch (e) {
    res.status(500).send(e);
  }
};
