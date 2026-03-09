import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const allowedOrigins = ["http://localhost:5173", "http://localhost:5174"];

const app = express();
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(
  express.json({
    limit: "20kb",
  })
);
app.use(
  express.urlencoded({
    limit: "10kb",
    extended: true,
  })
);
app.use(express.static("public"));

app.use(cookieParser());

// routes

import { consumerRouter } from "./routes/consumer.routes.js";
import { sellerRouter } from "./routes/seller.routes.js";
import { productRouter } from "./routes/product.routes.js";
import { categoryRouter } from "./routes/categories.routes.js";
import { adminRouter } from "./routes/admin.routes.js";
import { cartRouter } from "./routes/cart.routes.js";
import { orderRouter } from "./routes/order.routes.js";
import { logisticPartnerRouter } from "./routes/logisticPartner.routes.js";

app.use("/api/v1/consumers", consumerRouter);
app.use("/api/v1/partners", sellerRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/categories", categoryRouter);
app.use("/api/v1/orders", orderRouter);
app.use("/api/v1/cart", cartRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/logistics", logisticPartnerRouter);

export default app;
