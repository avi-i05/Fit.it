import { Server } from "socket.io";

let io;
const allowedOrigins = ["http://localhost:5173", "http://localhost:5174","https://test-admin-frontend-lake.vercel.app","https://test-partner-frontend.vercel.app"];


export const initSocket = (server) => {

  io = new Server(server, {
    cors: {
      origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
      methods: ["GET", "POST"],
      credentials: true
    }
  });

  io.on("connection", (socket) => {

    console.log("User connected:", socket.id);

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });

  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized");
  }

  return io;
};
