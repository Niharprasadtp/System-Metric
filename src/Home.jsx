import React, { useEffect, useState } from "react";
import axios from "axios";
import Plot from "react-plotly.js";
import { BsFillArchiveFill, BsFillGrid3X3GapFill, BsPeopleFill, BsFillBellFill ,BsThermometerHalf,BsMemory} from "react-icons/bs";
import{BiSolidMemoryCard,BiMemoryCard} from 'react-icons/bi'
import { WiDegrees } from 'react-icons/wi';
import io from 'socket.io-client';
import { times } from "lodash";

const socket = io('http://localhost:5000');

const Home = () => {
  const [temperatureData, setTemperatureData,setTimes,setTemperatureDatas] = useState([]);
  const [memoryData, setMemoryData] = useState({
    memoryTotal: [],
    usedMemory: [],
    freeMemory: [],
  });



  const fetchData = () => {
    // Fetch GPU temperature data
    axios
      .get("http://localhost:5000/gpu")
      .then((response) => {
        const temperature = response.data.controllers.map((item) => item.temperatureGpu);
        setTemperatureData(temperature);

        sendTemperatureData(temperature);
        
      })
      .catch((e) => {
        alert(e);
      });
      
      
      //fetch data from the database(time and temperature)

      axios
      .get("http://localhost:5000/temperature-data")
      .then((response) => {
        const temperatures = response.data.map((item) => item.temperature);
        const time = response.data.map((item) => item.time);
        
         setTemperatureDatas(temperatures);
        setTimes(time);
        sendTimes(time);
      })
      .catch((e) => {
        console.error("Error fetching temperature data:", e);
      });






    // Fetch memory usage data
    axios
      .get("http://localhost:5000/gpu")
      .then((response) => {
        const usedMemory = response?.data?.controllers?.map((item) => item.memoryUsed);
        const freeMemory = response?.data?.controllers?.map((item) => item.memoryFree);
        const memoryTotal = response?.data?.controllers?.map((item) => item.memoryTotal);
        setMemoryData({
          memoryTotal,
          usedMemory,
          freeMemory,
        });
        console.log("used", usedMemory);
       
      })
      .catch((e) => {
        alert(e);
      });
  };
  
  //add the temperature to the database
  console.log("Temperature", temperatureData);

  const sendTemperatureData = async (temperature) => {
   
    try {
      console.log("Sending temperature data:", temperature[0]);
      const response = await axios.post("http://localhost:5000/store-temp", { temperature: temperature[0] });
      console.log("successfully:", response.data);
    } catch (error) {
      console.error("Error storing temperature data:", error);
    }
  };
  


  useEffect(() => {
    // Fetch initial data
    fetchData();
    

    const intervalId = setInterval(fetchData, 2000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);









  return (
    <main className="main-container">
      <div className="main-title">
        <h3>DASHBOARD</h3>
      </div>

      <div className="main-cards">
        <div className="card">
          <div className="card-inner">
            <h3>TOTAL MEMORY</h3>
            <BsMemory className="card_icon" />
          </div>
          <h1>{memoryData.memoryTotal.length > 0 ? memoryData.memoryTotal[0] : "0"} GB</h1>
        </div>
        <div className="card">
          <div className="card-inner">
            <h3>TEMPERATURE</h3>
            <BsThermometerHalf className="card_icon" />
          </div>
          <h1>{temperatureData.length > 0 ? temperatureData[0] : ""} °C </h1>
        </div>
        <div className="card">
          <div className="card-inner">
            <h3>MEMORY USED</h3>
            <BiSolidMemoryCard className="card_icon" />
          </div>
          <h1>{memoryData.usedMemory.length > 0 ? memoryData.usedMemory[0] : ""} GB</h1>
        </div>
        <div className="card">
          <div className="card-inner">
            <h3>MEMORY FREE</h3>
            <BiMemoryCard className="card_icon" />
          </div>
          <h1>{memoryData.freeMemory.length > 0 ? memoryData.freeMemory[0] : ""} GB</h1>
        </div>
      </div>

      <div className="charts">
       
        <div>
          {temperatureData.length > 0 && (
            <Plot
              data={[
                {
                  domain: { x: [0, 1], y: [0, 1] },
                  value: temperatureData[0] ,
                  title: { text: "GPU Temperature" },
                  type: "indicator",
                  mode: "gauge+number",
                  delta: { reference: 0 },
                  gauge: {
                    axis: { range: [0, 100], steps: [{ range: [0, 30], color: "lightgray" }, { range: [30, 70], color: "lightgreen" }, { range: [70, 100], color: "lightred" }],
                  },
                },}
              ]}
              layout={{
                width: 400,
                height: 300,
                margin: { t: 0, b: 0 },
                paper_bgcolor:'rgba(0,0,0,0)',
                plot_bgcolor:'rgba(0,0,0,0)',
                font:{color:"#fff"}
              }}
            />
          )}
        </div>
        <div>
          {memoryData.memoryTotal.length > 0 && (
            <Plot
              data={[
                {
                  labels: ["Used Memory", "Free Memory",],
                  values: [memoryData.usedMemory[0], memoryData.freeMemory[0]],
                  type: "pie",
                  name: "Memory Usage",
                }
              ]}
              layout={{
                title: "Memory Usage",
                paper_bgcolor:'rgba(0,0,0,0)',
                plot_bgcolor:'rgba(0,0,0,0)',
                font:{color:"#fff"}
              }}
            />
          )}
        </div>

        
        
      </div>
      <div>
          { <Plot
            data={[
              {
                x:setTimes,
                y: setTemperatureData,
                type: "line",
                name: "GPU Temperature",
              }
            ]}
            layout={{
                paper_bgcolor:'rgba(0,0,0,0)',
                plot_bgcolor:'rgba(0,0,0,0)',
                font:{color:"#fff"},
              xaxis: {
                title: "Time",
                
              },
              yaxis: {
                title: "Temperature",
              },
            }}
          /> }
        </div>
    </main>
  );
};

export default Home;
