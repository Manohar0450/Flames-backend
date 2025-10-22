// server.js
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// ✅ MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI ||
  "mongodb+srv://manoharpoco_db_user:Manohar%402005@flames.vsuvsuh.mongodb.net/flamesDB?retryWrites=true&w=majority";

// Cache connection for serverless environments (like Vercel)
let cached = global.mongoose;
if (!cached) cached = global.mongoose = { conn: null, promise: null };

async function connectToDatabase() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000,
    }).then((mongoose) => mongoose);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

// ✅ Define Schema
const flamesSchema = new mongoose.Schema({
  name1: { type: String, required: true },
  name2: { type: String, required: true },
  result: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

// ✅ Create Model
const Flames = mongoose.models.Flames || mongoose.model("Flames", flamesSchema);

// ✅ Routes

// Test DB Connection
app.get("/api/test-db", async (req, res) => {
  try {
    await connectToDatabase();
    res.status(200).json({ success: true, message: "✅ Database connection active!" });
  } catch (error) {
    console.error("❌ DB Test Error:", error);
    res.status(500).json({ error: "Database connection failed", details: error.message });
  }
});

// Default route
app.get("/", (req, res) => {
  res.send("🔥 FLAMES Backend is running successfully!");
});

// POST: Save FLAMES result
app.post("/api/save", async (req, res) => {
  try {
    await connectToDatabase();

    const { name1, name2, result } = req.body;
    if (!name1 || !name2 || !result) {
      return res.status(400).json({ error: "All fields (name1, name2, result) are required." });
    }

    const newRecord = await Flames.create({ name1, name2, result });
    console.log("✅ Saved:", newRecord);
    res.status(200).json({ message: "Data saved successfully!", data: newRecord });
  } catch (err) {
    console.error("❌ Error saving data:", err);
    res.status(500).json({ error: "Internal Server Error", details: err.message });
  }
});

// GET: Fetch all saved FLAMES results
app.get("/api/results", async (req, res) => {
  try {
    await connectToDatabase();
    const allResults = await Flames.find().sort({ createdAt: -1 });
    res.status(200).json(allResults);
  } catch (err) {
    console.error("❌ Error fetching data:", err);
    res.status(500).json({ error: "Failed to fetch data", details: err.message });
  }
});

// ✅ Start server locally
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
