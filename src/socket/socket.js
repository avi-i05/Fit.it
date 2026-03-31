import { Server } from "socket.io";

let io;
<<<<<<< HEAD
const allowedOrigins = [
  process.env.CORS_ORIGIN_CLIENT,
  process.env.CORS_ORIGIN_ADMIN,
  process.env.CORS_ORIGIN_LOGISTIC,
  process.env.CORS_ORIGIN_PARTNER,
];
=======
const allowedOrigins = ["http://localhost:5173", "http://localhost:5174","https://test-admin-frontend-lake.vercel.app","https://test-partner-frontend.vercel.app"];

>>>>>>> 72852b9b68d734e00f737e3907d7e47e6e96874f

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: function (origin, callback) {
<<<<<<< HEAD
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error("Not allowed by CORS"));
        }
      },
=======
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
>>>>>>> 72852b9b68d734e00f737e3907d7e47e6e96874f
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
