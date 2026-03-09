import dotenv from "dotenv";
dotenv.config({
  path: "./.env",
});

import http from "http";
import connectDB from "./db/index.db.js";
import app from "./app.js";

import { initSocket } from "./socket/socket.js";

const server = http.createServer(app);

// initialize socket
initSocket(server);

connectDB()
  .then(() => {
    server.listen(process.env.PORT, () => {
      console.log(`Server running on port: ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.error(
      `Error in connecting to the database: ${error.message}`
    );
    process.exit(1);
  });