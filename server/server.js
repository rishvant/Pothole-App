import dotenv from "dotenv";
dotenv.config();
import express from "express";
import http from "http";
import connectDB from "./db/index.js";
import authRoutes from "./routes/authRoutes.js";
import cors from "cors";

const PORT = process.env.PORT || 3000;

const app = express();
connectDB();
app.use(express.json());
app.use(cors());

app.use("/api/auth", authRoutes);

const server = http.createServer(app);

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});