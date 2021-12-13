const { Studyroom, User } = require("../models");
const { getUTC } = require("./functions/utils");

module.exports = async (req, res) => {
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
  } catch (e) {
    res.status(500).send(e);
  }
};
