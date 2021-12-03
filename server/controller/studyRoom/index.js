const { socketio_data } = require("../../models");

const users = {};
const socketToRoom = {};

const newID = function () {
  return Math.random().toString(36).substr(2, 16);
};
//todo: model require("")
module.exports = {
  io: (socket, io) => {
    const maximum = 4;
    // console.log(
    //   "소켓 온",
    //   socket.on("join_room", (data) => {
    //     console.log(data.room);
    //   })
    // );
    socket.on("join_room", (data) => {
      console.log("유유아이디", data.uuid);
      if (users[data.room]) {
        //todo: 방이 이미 존재할때
        const length = users[data.room].length;
        if (length === maximum) {
          socket.to(socket.id).emit("room_full");
          return;
        }
        console.log("방이 존재할때", users[data.room]);
        users[data.room].push({ id: socket.id, email: data.email });
      } else {
        //todo: 방이 존재하지 않을때
        const socketData = socketio_data.findOrCreate({
          where: { uuid: data.uuid },
          defaults: {
            studeamer_id: socket.id,
          },
        });
        users[data.room] = [
          { uuid: newID(), id: socket.id, email: data.email },
        ];
        console.log("방이 존재하지않을때 방정보", users[data.room]);
      }
      socketToRoom[socket.id] = data.room;
      console.log("소켓투룸", socketToRoom[socket.id]);
      socket.join(data.room);
      console.log(
        "유저님이 입장하셨습니다.",
        `[${socketToRoom[socket.id]}]: ${socket.id} enter`
      );

      const usersInThisRoom = users[data.room].filter(
        (user) => user.id !== socket.id
      );

      console.log("방안에 누가있나요?", usersInThisRoom);
      io.sockets.to(socket.id).emit("all_users", users[data.room]);
    });

    socket.on("offer", (data) => {
      //console.log(data.sdp);
      socket.to(data.offerReceiveID).emit("getOffer", {
        sdp: data.sdp,
        offerSendID: data.offerSendID,
        offerSendEmail: data.offerSendEmail,
      });
    });

    socket.on("answer", (data) => {
      socket.to(data.answerReceiveID).emit("getAnswer", {
        sdp: data.sdp,
        answerSendID: data.answerSendID,
      });
    });

    socket.on("canidate", (data) => {
      socket.to(data.candidateReceiveID).emit("getCandidate", {
        candidate: data.candidate,
        candidateSendID: data.candidateSendID,
      });
    });

    socket.on("disconnect", () => {
      console.log(
        "여기는 exit",
        `[${socketToRoom[socket.id]}]: ${socket.id} exit`
      );
      const roomID = socketToRoom[socket.id];
      let room = users[roomID];
      if (room) {
        room = room.filter((user) => user.id !== socket.id);
        users[roomID] = room;
        if (room.length === 0) {
          delete users[roomID];
          return;
        }
      }
      socket.to(roomID).emit("user_exit", { id: socket.id });
      console.log(users);
    });
  },
};
