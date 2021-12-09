const { socketio_data } = require("../../models");

module.exports = {
  io: async (socket) => {
    socket.on("open_room", async (roomInfo) => {
      await socketio_data.create({
        uuid: roomInfo.uuid,
        user_id: roomInfo.id,
        title: roomInfo.title,
        thumbnail: roomInfo.thumbnail,
        headCount: 1,
      });
      socket.join(roomInfo.uuid);
    });

    socket.on("join_room", (viewerInfo) => {
      socket.join(viewerInfo.uuid);
      socket.to(viewerInfo.uuid).emit("welcome", {
        id: viewerInfo.id,
        username: viewerInfo.username,
        socketId: viewerInfo.socketId,
      });
      //webrtc 연결, 방금 들어온 클라이언트한테만
    });

    socket.on("offer", (offer, uuid, socketId, hostId) => {
      console.log("호스트가 offer 보냄", hostId);
      socket.to(uuid).emit("offer", offer, socketId, hostId);
      //viewers 배열도 같이 보내주기
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

    socket.on("leave_room", (userId) => {
      //headCount 1내리기
      //viewers 배열에서 삭제
    });

    socket.on("close_room", (userId) => {
      //데이터베이스에서 레코드 삭제
    });
  },
};
