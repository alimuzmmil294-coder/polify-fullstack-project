import "dotenv/config"; // 1. Load .env vars FIRST
import express from "express";
import cors from 'cors'
import { dbConnection } from "./src/configs/dbConnection.js"; // 2. Now import DB config

import allRoutes from "./src/routes/index.js";

const app = express();

// 3. Connect to database
dbConnection();

const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "https://polify-fullstack-project-ao42.vercel.app",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS origin denied: ${origin}`));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(express.json());

app.use("/api", allRoutes);

app.get("/", (req, res) => {
  res.send("Hello World by Muzammil Ali");
});

app.listen(3500, () => {
  console.log("http://localhost:3500");
});
