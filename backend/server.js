import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import sequelize from "./config/db.js"; // Sequelize instance
import userRoutes from "./routes/userRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";

const app = express();

const PORT = process.env.PORT || 3000;
const secret = process.env.COOKIE_SECRET;
const frontendBaseURL = process.env.FRONTEND_BASE_URL;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(secret));
app.use(
  cors({
    origin: process.env.FRONTEND_BASE_URL || "http://localhost:5173", // Frontend URL
    credentials: true,  // Allow cookies to be sent with the request
  })
);


// Routes
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/tasks", taskRoutes);

// Default route
app.get("/", (req, res) => {
  res.json({ message: "Hello, Welcome To Vooshfoods" });
});

// Start server and connect DB
sequelize
  .sync({ alter: true }) // `alter` ensures DB stays in sync with models
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✅ Server started on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Database connection failed:", err);
  });
