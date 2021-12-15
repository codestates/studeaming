const { User, Studyroom } = require("../../models");
const { getUTC } = require("../functions/utils");
const {
  startStudeaming,
  studeamHundredhours,
  watchHundredhours,
} = require("../functions/achievementCheck");

module.exports = {
  io: async (socket, io) => {
    socket.on("open_room", async (id, uuid) => {
      try {
        await startStudeaming(id);

        socket.join(uuid);
        socket.data.uuid = uuid;
        socket.data.userId = id;
      } catch (e) {}
    });

    socket.on("join_room", async (viewerInfo) => {
      socket.join(viewerInfo.uuid);
      socket.data.userId = viewerInfo.id;
      socket.data.uuid = viewerInfo.uuid;
      socket.data.username = viewerInfo.username;
      socket.data.joinedAt = Date.now();

      socket.to(viewerInfo.uuid).emit("welcome", {
        id: viewerInfo.id,
        username: viewerInfo.username,
        profileImg: viewerInfo.profileImg,
        socketId: viewerInfo.socketId,
      });

      try {
        await Studyroom.increment(
          { headCount: 1 },
          { where: { uuid: viewerInfo.uuid } }
        );
      } catch {}
    });

    socket.on("offer", (offer, uuid, socketId, hostId, soundIdx) => {
      console.log("호스트가 offer 보냄", hostId);
      socket.to(uuid).emit("offer", offer, socketId, hostId, soundIdx);
    });

    socket.on("answer", (answer, uuid, socketId) => {
      console.log("참여자가 answer 보냄");
      socket.to(uuid).emit("answer", answer, socketId);
    });

    socket.on("ice", (ice, uuid, recieverId, senderId) => {
      console.log("icecandidate", ice, "to", recieverId);
      socket.to(uuid).emit("ice", ice, recieverId, senderId);
    });

    socket.on("chat", (uuid, userId, chatIdx, chat) => {
      io.to(uuid).emit("newChat", uuid, userId, chatIdx, chat);
    });

    socket.on("get_viewer", (uuid, requestId, viewerInfo) => {
      socket.to(uuid).emit("get_viewer", requestId, viewerInfo);
    });

    socket.on("update_viewer", (uuid, viewer) => {
      socket.data.userId = viewer.id;
      socket.to(uuid).emit("update_viewer", viewer);
    });

    socket.on("disconnect", async () => {
      const uuid = socket.data.uuid;

      if (uuid) {
        try {
          const roomInfo = await Studyroom.findOne({
            where: { uuid },
            raw: true,
          });

          if (roomInfo) {
            if (roomInfo.user_id === socket.data.userId.toString()) {
              const studeaming = Math.round(
                (Date.now() - getUTC(roomInfo.createdAt)) / (1000 * 60)
              );

              await User.increment(
                { studeaming: studeaming },
                { where: { id: roomInfo.user_id } }
              );

              await studeamHundredhours(roomInfo.user_id);

              await Studyroom.destroy({ where: { uuid: uuid } });

              socket.to(uuid).emit("close_room");
            } else {
              const watching = Math.round(
                (Date.now() - socket.data.joinedAt) / (1000 * 60)
              );

              await User.increment(
                { watching: watching },
                { where: { id: socket.data.userId } }
              );

              await watchHundredhours(socket.data.userId);

              await Studyroom.decrement(
                { headCount: 1 },
                { where: { uuid: uuid } }
              );

              socket
                .to(uuid)
                .emit("leave_room", socket.id, socket.data.username);
            }
          }
        } catch {}
      }
    });
  },
};
