const { socketio_data } = require("../../models");

const users = {};
const socketToRoom = [];

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
      if (users[data.roomName]) {
        //todo: 방이 이미 존재할때
        const length = users[data.roomName].length;
        if (length === maximum) {
          socket.to(socket.id).emit("room_full");
          return;
        }
        //todo : 방제목, 썸네일, createdAt, updatadAt, UCT?
        users[data.roomName].push({
          uuid: socket.id,
        });
        //todo: 만들어진방에 들어오는 유저들
        socketio_data
          .findOrCreate({
            where: { user_id: data.studeamerID },
            default: {
              title: data.roomName,
              thumbnail: data.thumbnail,
              HeadCount: users[data.roomName].HeadCount++,
            },
          })
          .then(([data, created]) => {
            if (!created) {
              return;
            }
          })
          .catch((e) => {
            console.log(e);
          });
      } else {
        //todo: 방이 존재하지 않을때
        console.log("방제목", data.roomName);
        socketio_data
          .findOrCreate({
            where: { user_id: data.studeamerID },
            defaults: {
              title: data.roomName,
              uuid: socket.id,
              user_id: data.studeamerID,
              thumbnail: data.thumbnail,
              HeadCount: 1,
            },
          })
          .then(([data, created]) => {
            //todo: 새로 만들어지는 상황이 아니라면 그냥 return
            if (!created) return;
          })
          .catch((e) => console.log(e));
        users[data.roomName] = [
          {
            title: data.roomName,
            uuid: socket.id,
            user_id: data.studeamerID,
            HeadCount: 1,
          },
        ];
        console.log("넌 뭐니", users[data.roomName]);
      }
      socketToRoom.push({ MakeRoom: data.roomName });
      console.log("넌 뭐니 2", socketToRoom);
      socket.join(data.roomName);

      console.log(
        "유저님이 입장하셨습니다.",
        `[${data.roomName}]: ${socket.id} enter`
      );

      const usersInThisRoom = users[data.roomName].filter(
        (user) => user.uuid !== socket.id
      );

      console.log("방안에 누가있나요?", usersInThisRoom);
      io.sockets.to(socket.id).emit("all_users", users[data.roomName]);
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
      socket
        .to(data.candidateReceiveID)
        .emit("getCandidate roomID = socketToRoom[data.roomName];", {
          candidate: data.candidate,
          candidateSendID: data.candidateSendID,
        });
    });

    socket.on("disconnect", (data) => {
      // console.log("여기는 exit", `[${socketToRoom}]: ${socket.id} exit`);
      // let roomID = socketToRoom[data.roomName];
      let roomID = socketToRoom.forEach((room) => {});
      console.log("룸아이디", roomID);
      let room = users[roomID];
      if (room) {
        room = room.filter((user) => user.uuid !== socket.id);
        users[roomID] = room;
        if (room.length === 0) {
          delete users[roomID];
          return;
        } else {
          // todo: 방에서 나갈때 db에서 삭제
          socketio_data
            .destory({
              where: { uuid: room.uuid },
            })
            .then((data) => {
              if (data) {
                res.send(204).send();
              }
            })
            .catch((e) => {
              console.log(e);
            });
        }
      }
      roomID = socketToRoom[data.roomName];

      socket.to(roomID).emit("user_exit", { id: socket.id });
      console.log("디스 커넥트 유저스", users);
    });
  },
};
