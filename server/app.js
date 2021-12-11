const express = require("express");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const cron = require("node-cron");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");
const { Server } = require("socket.io");
const authRouter = require("./routes/auth");
const userRouter = require("./routes/user");
const studyToggleRouter = require("./routes/studyToggle");
const studylogRouter = require("./routes/studylog");
const verifyRouter = require("./routes/verify");
const studyroomRouter = require("./routes/studyroom");
const cronJob = require("./controller/functions/cronJob");
const studyRoom = require("./controller/studyRoom/index");
const options = require("./swagger.js");

const apiSpec = swaggerJsdoc(options);
require("dotenv").config();

const app = express();
const corsOpt = {
  origin: process.env.CLIENT_URL || "http://localhost:3000",
  credentials: true,
  samesite: "none",
  secure: true,
};

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(cors(corsOpt));

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

app.use(function (err, req, res, next) {
  res.status(err.status || 404);
  res.send(err);
});

const PORT = process.env.HTTPS_PORT || 4000;

const http = require("http");

const server = http.Server(app).listen(PORT, () => {
  console.log("Express server listening on port ");
});

const io = new Server(server, {
  cors: corsOpt,
  transports: ["websocket"],
});

io.on("connection", (socket) => studyRoom.io(socket, io));

module.exports = server;
