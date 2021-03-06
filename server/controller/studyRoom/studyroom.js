const { Studyroom, User } = require("../../models");
const { getUTC } = require("../functions/utils");
const { isAccessAuthorized } = require("../functions/token");

module.exports = {
  get: async (req, res) => {
    try {
      const studyrooms = await Studyroom.findAll({
        attributes: [
          "uuid",
          "title",
          "thumbnail",
          "user_id",
          "headCount",
          "createdAt",
        ],
        raw: true,
      });

      const roomList = await Promise.all(
        studyrooms.map(async (room) => {
          room.createdAt = getUTC(room.createdAt) / (60 * 1000);

          if (room.user_id !== "0") {
            const user = await User.findOne({
              where: { id: room.user_id },
              raw: true,
            });

            return {
              ...room,
              username: user.username,
              profileImg: user.profileImg,
            };
          } else {
            return {
              ...room,
              username: "Studeaming",
              profileImg: "",
            };
          }
        })
      );

      res.send({ roomList: roomList });
    } catch {
      res.sendStatus(500);
    }
  },

  post: async (req, res) => {
    try {
      const user = isAccessAuthorized(req);
      const thumbnail = res.req.file ? res.req.file.location : null;

      const studyroom = await Studyroom.create({
        uuid: req.body.uuid,
        user_id: user.id,
        title: req.body.title,
        thumbnail: thumbnail,
        headCount: 1,
      });

      if (studyroom) {
        res.send({ studyroom: studyroom });
      } else {
        res.sendStatus(500);
      }
    } catch {
      res.sendStatus(500);
    }
  },
};
