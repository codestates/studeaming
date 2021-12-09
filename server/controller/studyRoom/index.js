const { socketio_data } = require("../../models");

module.exports = {
  io: async (socket) => {
    socket.on("open_room", async (roomInfo) => {
      await socketio_data.create({
        uuid: roomInfo.uuid,
        user_id: roomInfo.id,
        title: roomInfo.title,
        thumbnail: roomInfo.thumbnail || "",
        headCount: 1,
      });
      socket.join(roomInfo.uuid);
      socket.data.uuid = roomInfo.uuid;
      socket.data.userId = roomInfo.id;
    });

    socket.on("join_room", async (viewerInfo) => {
      socket.join(viewerInfo.uuid);
      socket.data.userId = viewerInfo.id;
      socket.data.uuid = viewerInfo.uuid;
      socket.to(viewerInfo.uuid).emit("welcome", {
        id: viewerInfo.id,
        username: viewerInfo.username,
        profileImg: viewerInfo.profileImg,
        socketId: viewerInfo.socketId,
      });

      await socketio_data.increment(
        { headCount: 1 },
        { where: { uuid: viewerInfo.uuid } }
      );
    });

    socket.on("offer", (offer, uuid, socketId, hostId, viewers) => {
      console.log("호스트가 offer 보냄", hostId);
      socket.to(uuid).emit("offer", offer, socketId, hostId, viewers);
    });

    socket.on("answer", (answer, uuid, socketId) => {
      console.log("참여자가 answer 보냄");
      socket.to(uuid).emit("answer", answer, socketId);
    });

    socket.on("ice", (ice, uuid, socketId) => {
      console.log("icecandidate", ice, "to", socketId);
      socket.to(uuid).emit("ice", ice, socketId);
    });

    socket.on("chat", (uuid, userId, chatIdx) => {
      socket.to(uuid).emit("newChat", userId, chatIdx);
    });

    socket.on("disconnect", async () => {
      //새로고침 없이 페이지를 이동해도 이벤트가 발생해야 함
      const roomInfo = await socketio_data.findOne({
        where: { uuid: socket.data.uuid },
        raw: true,
      });

      if (roomInfo.user_id === socket.data.userId) {
        //호스트가 떠난 경우
        await socketio_data.destroy({ where: { uuid: uuid } });

        socket.to(uuid).emit("close_room");
      } else {
        //시청자가 떠난 경우
        await socketio_data.decrement(
          { headCount: 1 },
          { where: { uuid: socket.data.uuid } }
        );
        socket.to(uuid).emit("leave_room", socket.data.userId);
      }
    });
  },
};
