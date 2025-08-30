import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/userRoutes.js";
import roleRoutes from "./routes/rolesRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";

dotenv.config();
const app = express();

app.use(express.json());
app.use("/user", authRoutes);
app.use("/role", roleRoutes);
app.use("/category", categoryRoutes);

app.listen(process.env.PORT || 4000, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
