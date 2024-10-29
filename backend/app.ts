// src/app.ts

import express from "express";
import authRoutes from "./routes/authRoutes";
import fileRoutes from "./routes/fileRoutes";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/files", fileRoutes);

export default app;
