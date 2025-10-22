// api/flames.js  (Vercel expects files under /api for serverless functions)

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// ✅ Connect to MongoDB Atlas
if (!mongoose.connection.readyState) {
  mongoose.connect(
    "mongodb+srv://manoharpoco_db_user:Manohar%402005@flames.vsuvsuh.mongodb.net/flamesDB"
  )
    .then(() => console.log("✅ MongoDB Connected Successfully"))
    .catch(err => console.error("❌ MongoDB Connection Error:", err));
}

// ✅ Schema
const flamesSchema = new mongoose.Schema({
  name1: { type: String, required: true },
  name2: { type: String, required: true },
  result: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

// ✅ Model
const Flames = mongoose.models.Flames || mongoose.model("Flames", flamesSchema);

// ✅ Route: Save data
app.post("/flames", async (req, res) => {
  try {
    const { name1, name2, result } = req.body;

    if (!name1 || !name2 || !result) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const newRecord = new Flames({ name1, name2, result });
    await newRecord.save();

    res.status(200).json({ message: "Saved successfully!", result });
  } catch (err) {
    console.error("❌ Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ Route: Fetch results
app.get("/results", async (req, res) => {
  try {
    const results = await Flames.find().sort({ createdAt: -1 });
    res.status(200).json(results);
  } catch (err) {
    console.error("❌ Error fetching:", err);
    res.status(500).json({ error: "Failed to fetch results" });
  }
});

// ✅ Default route
app.get("/", (req, res) => {
  res.send("🔥 FLAMES Backend is running successfully!");
});

// ✅ Export the app for Vercel (❌ no app.listen)
module.exports = app;
