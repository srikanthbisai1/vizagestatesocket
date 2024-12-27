import { Server } from "socket.io";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
const io = new Server({
 cors: {
   origin: "https://deploy-estate.vercel.app",
    methods: ["GET", "POST"],
    credentials: true,
  },
});
let onlineUser = [];

const addUser = (userId, socketId) => {
  if (!onlineUser.find((user) => user.userId === userId)) {
    onlineUser.push({ userId, socketId });
  }
};

const removeUser = (socketId) => {
  onlineUser = onlineUser.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  return onlineUser.find((user) => user.userId === userId);
};

io.on("connection", (socket) => {
  socket.on("newUser", (userId) => {
    addUser(userId, socket.id);
  });

  socket.on("sendMessage", ({ receiverId, data }) => {
    const receiver = getUser(receiverId);
    if (receiver) {
      io.to(receiver.socketId).emit("getMessage", data);
    }
  });

  socket.on("disconnect", () => {
    removeUser(socket.id);
  });
});

io.listen(4000, () => {
  console.log("Socket.io server is running on port 4000");
});
