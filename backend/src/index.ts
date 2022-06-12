import * as express from "express";
import * as cors from "cors";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import { addUser, getUserByRoom, removeUser } from "./services";

const app = express();
const server = createServer(app);
app.use(cors());

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", async(socket: Socket) => {
  const { name = "", room = "" } = socket.handshake.query;
  if(!name || !room) return false
  const { user } = await addUser({ id: socket.id, room, name });
  console.log({user})
  socket.join(user.room);

  io.in(user.room).emit("allUsers", {
    room: user.room,
    users: getUserByRoom(user.room),
  });

  io.on("send_message", (data) => {
    io.in(user.room).emit("send_message", data);
  });

  io.on("start_typing", (data) => {
    io.in(user.room).emit("start_typing", data);
  });

  io.on("stop_typing", (data) => {
    io.in(user.room).emit("stop_typing", data);
  });

  io.on("disconnect", () => {
    removeUser(socket.id);
    io.in(user.room).emit("user_leave", user);
    socket.leave(user.room as string);
  });
});

app.get("/", (req, res) => {
  res.send("connection");
});

const port = process.env.PORT || 8000;
server.listen(port, () => {
  console.log("listening on port " + port);
});
