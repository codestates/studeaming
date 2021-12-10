const { socketio_data } = require("../../models");

module.exports = {
  io: async (socket, io) => {
    socket.on("open_room", async (roomInfo) => {
      try {
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
      } catch (e) {}
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

      try {
        await socketio_data.increment(
          { headCount: 1 },
          { where: { uuid: viewerInfo.uuid } }
        );
      } catch {}
    });

    socket.on("offer", (offer, uuid, socketId, hostId) => {
      console.log("호스트가 offer 보냄", hostId);
      socket.to(uuid).emit("offer", offer, socketId, hostId);
    });

    socket.on("answer", (answer, uuid, socketId) => {
      console.log("참여자가 answer 보냄");
      socket.to(uuid).emit("answer", answer, socketId);
    });

    socket.on("ice", (ice, uuid, recieverId, senderId) => {
      console.log("icecandidate", ice, "to", recieverId);
      socket.to(uuid).emit("ice", ice, recieverId, senderId);
    });

    socket.on("chat", (uuid, userId, chatIdx, newchat) => {
      io.to(uuid).emit("newChat", uuid, userId, chatIdx, newchat);
      // uuid.forEach((data) => {
      //   const { socketId } = data;
      //   if (socketId) {
      //     console.log("소켓아이디", socketId);
      //     socket.to(socketId).emit("newChat", userId, chatIdx);
      //   }
      // });
    });

    socket.on("get_viewer", (uuid, requestId, viewerInfo) => {
      socket.to(uuid).emit("get_viewer", requestId, viewerInfo);
    });

    socket.on("update_viewer", (uuid, viewer) => {
      console.log(viewer);
      socket.data.userId = viewer.id;
      socket.to(uuid).emit("update_viewer", viewer);
    });

    socket.on("disconnect", async () => {
      const uuid = socket.data.uuid;

      if (uuid) {
        try {
          const roomInfo = await socketio_data.findOne({
            where: { uuid: socket.data.uuid },
            raw: true,
          });

          if (roomInfo) {
            if (roomInfo.user_id === socket.data.userId.toString()) {
              await socketio_data.destroy({ where: { uuid: uuid } });

              socket.to(uuid).emit("close_room");
            } else {
              await socketio_data.decrement(
                { headCount: 1 },
                { where: { uuid: uuid } }
              );

              socket.to(uuid).emit("leave_room", socket.id);
            }
          }
        } catch (e) {}
      }
    });
  },
};
