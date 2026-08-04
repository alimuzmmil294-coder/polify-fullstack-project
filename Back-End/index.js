import "dotenv/config"; // 1. Load .env vars FIRST
import express from "express";
import cors from "cors";
import { dbConnection } from "./src/configs/dbConnection.js"; // 2. Now import DB config

import allRoutes from "./src/routes/index.js";

const app = express();

// 3. Connect to database
dbConnection();

const corsOptions = {
  origin: true,
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Origin",
    "X-Requested-With",
    "Content-Type",
    "Accept",
    "Authorization",
  ],
};

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", req.headers.origin || "*");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization",
  );
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS",
  );
  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }
  next();
});

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
app.use(express.json());

app.use("/api", allRoutes);

app.get("/", (req, res) => {
  res.send("Hello World by Muzammil Ali");
});

app.listen(3500, () => {
  console.log("http://localhost:3500");
});
