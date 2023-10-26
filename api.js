const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");
const si = require("systeminformation");

// Middleware
app.use(cors());
app.use(express.json());

app.listen(5000, () => {
  console.log("Server is connected");
});

// Endpoint to get GPU information
app.get("/gpu", async (req, res) => {
  try {
    const gpuData = await si.graphics();
    res.json(gpuData);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch GPU information" });
  }
});

// Endpoint to get system time
app.get("/system-time", (req, res) => {
  const currentTime = new Date();
  res.json({ time: currentTime });
});

// Endpoint to get system memory information
app.get("/memory", async (req, res) => {
  try {
    const memoryData = await si.mem();
    res.json(memoryData);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch memory information" });
  }
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
