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
      console.log("썸네일", data.thumbnail);
      if (users[data.room]) {
        //todo: 방이 이미 존재할때
        const length = users[data.room].length;
        if (length === maximum) {
          socket.to(socket.id).emit("room_full");
          return;
        }
        users[data.room].push({
          id: socket.id,
          email: data.email,
          studeamer_id: socket.id,
          thumbnail: data.thumbnail,
        });
      } else {
        //todo: 방이 존재하지 않을때
        console.log("방제목", data.room);
        socketio_data
          .findOrCreate({
            where: { uuid: data.uuid },
            defaults: {
              studeamer_id: socket.id,
              thumbnail: data.thumbnail,
            },
          })
          .then(([data, created]) => {
            //todo: 새로 만들어지는 상황이 아니라면 그냥 return
            if (!created) return;
          })
          .catch((e) => console.log(e));
        users[data.room] = [
          {
            uuid: newID(),
            id: socket.id,
            email: data.email,
            studeamer_id: socket.id,
            thumbnail: data.thumbnail,
          },
        ];
      }
      socketToRoom[socket.id] = data.room;
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
