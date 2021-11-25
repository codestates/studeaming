const express = require("express");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const fs = require("fs");
const https = require("https");
const cors = require("cors");
const app = express();
const studyRoom = require("./controller/studyRoom");
const { Server } = require("socket.io");
require("dotenv").config();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(
  cors({
    origin: process.env.CLIENT_URL || "https://localhost:3000",
    credentials: true,
    samesite: "none",
    secure: true,
  })
);

app.get("/favicon.ico", function (req, res) {
  res.sendStatus(204);
});

app.get("/", (req, res) => {
  res.send("Hello World");
});

//경로 설정

app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  res.status(err.status || 500);
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
  const io = new Server(server);
  io.on("connection", studyRoom.io);
  server = app.listen(PORT, () => console.log("http server runnning"));
}

module.exports = server;
