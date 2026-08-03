import "dotenv/config"; // 1. Load .env vars FIRST
import express from "express";
import cors from 'cors'
import { dbConnection } from "./src/configs/dbConnection.js"; // 2. Now import DB config

import allRoutes from "./src/routes/index.js";

const app = express();

// 3. Connect to database
dbConnection();

app.use(cors({
  origin:"http://localhost:5173",
   credentials:true
}))
app.use(express.json());

app.use("/api", allRoutes);

app.get("/", (req, res) => {
  res.send("Hello World by Muzammil Ali");
});

app.listen(3500, () => {
  console.log("http://localhost:3500");
});
