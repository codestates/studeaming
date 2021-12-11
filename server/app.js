const express = require("express");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const fs = require("fs");
const https = require("https");
const cors = require("cors");
const cron = require("node-cron");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");
const { Server } = require("socket.io");

const studyRoom = require("./controller/studyRoom/index");
const authRouter = require("./routes/auth");
const userRouter = require("./routes/user");
const studyToggleRouter = require("./routes/studyToggle");
const studylogRouter = require("./routes/studylog");
const verifyRouter = require("./routes/verify");
const studyroomRouter = require("./routes/studyroom");
const cronJob = require("./controller/functions/cronJob");
const options = require("./swagger.js");

const apiSpec = swaggerJsdoc(options);
require("dotenv").config();

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  })
);

cron.schedule("0 0 * * 1", () => {
  cronJob();
});

app.get("/favicon.ico", (req, res) => {
  res.status(204);
  // #swagger.ignore = true
});

app.get("/", (req, res) => {
  res.send("Hello World");
  // #swagger.ignore = true
});

app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/studylog", studylogRouter);
app.use("/studytoggle", studyToggleRouter);
app.use("/studyroom", studyroomRouter);
app.use("/verification", verifyRouter);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(apiSpec));
//경로 설정

//app.get("/*", (_, res) => res.redirect("/"));

app.use(function (err, req, res, next) {
  res.status(err.status || 404);
  res.send(err);
});

const PORT = process.env.HTTPS_PORT || 4000;

let server;

if (fs.existsSync("./key.pem") && fs.existsSync("./cert.pem")) {
  const privateKey = fs.readFileSync(__dirname + "/key.pem", "utf8");
  const certificate = fs.readFileSync(__dirname + "/cert.pem", "utf8");
  const credentials = { key: privateKey, cert: certificate };

  server = https.createServer(credentials, app);
  const io = new Server(server);
  io.on("connection", studyRoom.io);
  server.listen(PORT, () => console.log("https server runnning"));
} else {
  //todo:// https랑 같이 사용할경우 One and only one of the port server or no Server options must be specified
  //todo:// 해당 에러 발생 , 임시로 에러 해결을 위해 port 4001로 변경, 차후에 https 배포되면 여기는 필요없음
  // const WebSocket = require("ws").Server;
  const http = require("http");
  // todo: http를 따로 설정하고
  server = http.Server(app).listen(PORT, function () {
    console.log("Express server listening on port ");
  });

  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:3000",
      credentials: true,
    },
    transports: ["websocket"],
  });

  io.on("connection", (socket) => studyRoom.io(socket, io));
}

module.exports = server;
