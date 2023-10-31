import React, { useEffect, useState } from "react";
import axios from "axios";
import Plot from "react-plotlyjs";

const Linechart = () => {
  const [temperatureData, setTemperatureData] = useState([]);
  const [memoryData, setMemoryData] = useState({
    memoryTotal: [],
    usedMemory: [],
    freeMemory: [],
  });

  // const sendTemperatureData = async (data) => {
  //   try {
  //     const response = await axios.post("http://localhost:5000/store-temperature", { temperature: data });
  //     console.log("Temperature data stored successfully:", response.data);
  //   } catch (error) {
  //     console.error("Error storing temperature data:", error);
  //   }
  // };

  const fetchData = async () => {
    try {
      // Fetch GPU temperature data
      const responseGpu = await axios.get("http://localhost:5000/gpu");
      const temperature = responseGpu.data.controllers.map((item) => item.temperatureGpu);

      console.log("Temperature data received:", temperature);

      // Send temperature data to the server
      sendTemperatureData(temperature);

      setTemperatureData(temperature);

      // Fetch memory data
      const responseMemory = await axios.get("http://localhost:5000/memory");
      const usedMemory = responseMemory?.data?.controllers?.map((item) => item.memoryUsed);
      const freeMemory = responseMemory?.data?.controllers?.map((item) => item.memoryFree);
      const memoryTotal = responseMemory?.data?.controllers?.map((item) => item.memoryTotal);

      console.log("Memory data received:", usedMemory, freeMemory, memoryTotal);

      setMemoryData({
        memoryTotal,
        usedMemory,
        freeMemory,
      });
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    // Fetch initial data
    fetchData();

    // Fetch and send data every 2 seconds
    const intervalId = setInterval(() => {
      fetchData();
    }, 2000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    <div>
      <div>
        <Plot
          data={[
            {
              x: [...Array(temperatureData.length).keys()],
              y: temperatureData,
              type: "scatter",
              mode: "lines+markers",
              name: "GPU Temperature",
            },
          ]}
          layout={{
            xaxis: {
              title: "Time",
            },
            yaxis: {
              title: "Temperature",
            },
            title: "GPU Temperature Over Time",
          }}
        />
      </div>
      <div>
        {memoryData.memoryTotal.length > 0 && (
          <Plot
            data={[
              {
                labels: ["Used Memory", "Free Memory", "Total Memory"],
                values: [
                  memoryData.usedMemory[0],
                  memoryData.freeMemory[0],
                  memoryData.memoryTotal[0],
                ],
                type: "pie",
                name: "Memory Usage",
              },
            ]}
            layout={{
              title: "Memory Usage",
            }}
          />
        )}
      </div>
    </div>
  );
};

export default Linechart;
