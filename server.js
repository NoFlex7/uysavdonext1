import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import adminRoutes from "./rules/admin.js";
import authRoutes from "./rules/auth.js"; // 👈 QO‘SHILDI

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB ulandi"))
  .catch(err => console.log(err));

app.use("/api", adminRoutes);
app.use("/api/auth", authRoutes); // 👈 LOGIN SHU YERDA

app.listen(5000, () => {
  console.log("Server 5000-portda ishlayapti");
});
