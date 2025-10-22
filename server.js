// server.js

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

// ✅ Middleware
app.use(cors());
app.use(bodyParser.json());

// ✅ Connect to MongoDB Atlas
mongoose
  .connect(
    "mongodb+srv://manoharpoco_db_user:Manohar%402005@flames.vsuvsuh.mongodb.net/flamesDB",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// ✅ Define Schema
const flamesSchema = new mongoose.Schema({
  name1: { type: String, required: true },
  name2: { type: String, required: true },
  result: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

// ✅ Create Model
const Flames = mongoose.model("Flames", flamesSchema);

// ✅ Default route
app.get("/", (req, res) => {
  res.send("🔥 FLAMES Backend is running successfully on Vercel!");
});

// ✅ POST: Save FLAMES result (Now uses /api/save)
app.post("/api/save", async (req, res) => {
  try {
    const { name1, name2, result } = req.body;

    if (!name1 || !name2 || !result) {
      return res.status(400).json({
        error: "All fields (name1, name2, result) are required.",
      });
    }

    const newRecord = new Flames({ name1, name2, result });
    await newRecord.save();

    console.log("✅ Saved:", newRecord);
    res
      .status(200)
      .json({ message: "Data saved successfully!", data: newRecord });
  } catch (err) {
    console.error("❌ Error saving data:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ GET: Fetch all saved FLAMES results (Now uses /api/results)
app.get("/api/results", async (req, res) => {
  try {
    const allResults = await Flames.find().sort({ createdAt: -1 });
    res.status(200).json(allResults);
  } catch (err) {
    console.error("❌ Error fetching data:", err);
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

// ✅ Start server (For local testing)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);

// ✅ For Vercel deployment
module.exports = app;
