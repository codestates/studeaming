const { Op } = require("sequelize");
const { User, Currentlog } = require("../../models");
const { getStudyTime, getStudylogs } = require("../functions/model");

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

    const now = Date.now() / (1000 * 60);
    const aMonthAgo = now - 30 * 24 * 60;

    const studylogs = await getStudylogs(user.id, aMonthAgo, now);
    const studyTime = await getStudyTime(studylogs);

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
