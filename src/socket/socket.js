import { Server } from "socket.io";

let io;
const allowedOrigins = [
  process.env.CORS_ORIGIN_CLIENT,
  process.env.CORS_ORIGIN_ADMIN,
  process.env.CORS_ORIGIN_LOGISTIC,
  process.env.CORS_ORIGIN_PARTNER,
];

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
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("join_partner_room", (partnerId) => {
      socket.join(`partner_${partnerId}`);
      console.log(`Partner ${partnerId} joined room`);
    });

    socket.on("join_admin_room", (adminId) => {
      socket.join("admin_room");
      console.log(`Admin ${adminId} joined admin room`);
    });

    socket.on("update_location", (data) => {
      const { partnerId, location, orderId } = data;
      console.log(`Location update from partner ${partnerId}:`, location);
      
      if (orderId) {
        io.emit(`order_location_${orderId}`, { partnerId, location });
      }
      
      io.emit(`partner_location_${partnerId}`, location);
    });

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
