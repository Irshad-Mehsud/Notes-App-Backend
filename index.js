
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import routes from "./src/routes/index.js";

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(
//   cors({
//     origin: true, // Allow all origins (for development; adjust for production)
//     credentials: true,
//     allowedHeaders: ["Content-Type", "Authorization"],
//   })
// );

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://notes-app-frontend-swart.vercel.app"
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

const ENV = process.env;

// MongoDB connection with optimized settings for Serverless
const MONGO_URI = `mongodb+srv://${ENV.DB_USER}:${ENV.DB_PASSWORD}@irshadcluster.w5dqwxs.mongodb.net/${ENV.DB_NAME}?retryWrites=true&w=majority&appName=IrshadCluster`;

// Database connection logic (Cached for Vercel performance)
let isConnected = false;
const connectDB = async () => {
  if (isConnected) {
    console.log("MongoDB already connected.");
    return;
  }
  console.log("Attempting MongoDB connection...");
  try {
    const db = await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 5000, // Reduced for faster serverless cold starts
    });
    isConnected = db.connections[0].readyState === 1;
    if (isConnected) {
      console.log("Connected to MongoDB Atlas");
    } else {
      console.error("MongoDB connection failed: readyState=", db.connections[0].readyState);
    }
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
};

// Middleware to ensure DB is connected before processing requests
app.use(async (req, res, next) => {
  await connectDB();
  next();
});

app.use("/api", routes);

app.get("/", (req, res) => {
  res.send("Backend is running successfully!");
});

// ✅ FINAL EXPORT: Vercel needs the 'app' instance directly
export default app;

// ✅ Local development only
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, async () => {
    console.log(`🚀 Server is running on port ${PORT}`);
    await connectDB();
  });
}
