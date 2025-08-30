import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/userRoutes.js";
import roleRoutes from "./routes/rolesRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use("/user", authRoutes);
app.use("/role", roleRoutes);
app.use("/category", categoryRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.listen(process.env.PORT || 4000, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
