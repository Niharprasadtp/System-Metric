const express = require("express");
const app = express();
const cors = require("cors");
// const pool = require("./db");
const si = require("systeminformation");

// Middleware
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Endpoint to get GPU information
app.get("/gpu", async (req, res) => {
  try {
    const gpuData = await si.graphics();
    res.json(gpuData);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch GPU information", detail: error.message });
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
    res.status(500).json({ error: "Failed to fetch memory information", detail: error.message });
  }
});

// New API endpoint to store temperature data
app.post("/store-temperature", async (req, res) => {
  try {
    const { temperature } = req.body;

    console.log("Received temperature:", temperature);

    if (typeof temperature === "number") {
      const insertQuery = "INSERT INTO temperature_data (temperature) VALUES ($1)";
      const values = [temperature];

      pool.query(insertQuery, values, (error, result) => {
        if (error) {
          console.error("Database error:", error);
          res.status(500).json({ error: "Error storing temperature data", dbError: error.message });
        } else {
          console.log("Temperature data inserted successfully");
          res.status(201).json({
            message: "Temperature data inserted successfully",
            id: result.rows[0] ? result.rows[0].id : null, 
          });
        }
      });
    } else {
      res.status(400).json({ error: "Invalid temperature data format" });
    }
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ error: "Internal server error", detail: error.message });
  }
});
