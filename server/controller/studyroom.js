const { socketio_data, User } = require("../models");

module.exports = async (req, res) => {
  try {
    const studyrooms = await socketio_data.findAll({
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
        const user = await User.findOne({
          where: { id: room.user_id },
          raw: true,
        });

        room.createdAt = Date.now(room.createdAt);

        return {
          ...room,
          username: user.username,
          profileImg: user.profileImg,
        };
      })
    );

    res.send({ roomList: roomList });
  } catch (e) {
    res.status(500).send(e);
  }
};
