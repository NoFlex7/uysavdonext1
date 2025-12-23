import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import adminRoutes from "./rules/admin.js";

dotenv.config();
const app = express();

app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB ulandi"))
  .catch(err => console.log(err));

app.use("/api", adminRoutes);

app.listen(5000, () => {
  console.log("Server 5000-portda ishlayapti");
});
