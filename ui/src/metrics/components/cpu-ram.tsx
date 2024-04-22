// Commands to build and update extension:
  // docker build --tag=dockular/my-extension:latest .
  // docker extension update dockular/my-extension:latest

// Import React hooks and components

import Slider from '@mui/material/Slider';
import React, { useState, useEffect } from 'react';
import { Paper, Button, Container, Stack, Typography } from '@mui/material';
import { ResponsiveLine } from '@nivo/line';
import { createDockerDesktopClient } from '@docker/extension-api-client';
import { blueGrey } from '@mui/material/colors';

// Create Docker client
const client = createDockerDesktopClient();

// Custom hook to use Docker desktop client
function useDockerDesktopClient() {
  return client;
}

// Function to get current date and time
function getCurrentDateTime() {
  const currentDate = new Date();
  const hours = currentDate.getHours().toString().padStart(2, '0');
  const minutes = currentDate.getMinutes().toString().padStart(2, '0');
  const seconds = currentDate.getSeconds().toString().padStart(2, '0');
  
  return `${hours}:${minutes}:${seconds}`;
}

// Metrics component
export function Metrics() {
  // State variables
  const [dataCPU, setCPU] = useState<any>([{ id: 'Sample Dataset', data: [{ x: 0, y: 0 }] }]);
  const [dataRAM, setRAM] = useState<any>([{ id: 'Sample Dataset', data: [{ x: 0, y: 0 }] }]);
  const [isStarted, setIsStarted] = useState(false);
  const [containerList, setContainerList] = useState<any[]>([]);
  const [containerNamesList, setContainerNamesList] = useState<any[]>([]);
  const [selectedContainerIndex, setSelectedContainerIndex] = useState<number | null>(null); 
  const [selectedMemory, setSelectedMemory] = useState(512); // Initial value is 512 MB

  // Docker desktop client
  const ddClient = useDockerDesktopClient();

  // Effect to fetch container list
  useEffect(() => {
    if (!containerList[0]) {
      ddClient.docker.cli.exec("ps", ["--all", "--format", '"{{json .}}"']).then((result) => {
        const statsContainerData = result.parseJsonLines();
        const containerArray = [];
        const namesList = [];
        for (const key in statsContainerData) {
          const value = statsContainerData[key];
          containerArray.push(value.ID);
          namesList.push(value.Image);
        }
        setContainerList(containerArray);
        setContainerNamesList(namesList);
      });
    }
  }, [containerList]);

  // Function to fetch and display container stats
  const fetchAndDisplayResponse1 = async () => {
    if (selectedContainerIndex !== null) {
      const result = await ddClient.docker.cli.exec("stats", [containerList[selectedContainerIndex], "--no-stream", "--format", '"{{json .}}"']);
      const statsData = result.parseJsonLines();
      let cpuPoint = 0;
      let ramPoint = 0;

      for (const key in statsData) {
        const value = statsData[key];
        cpuPoint = value.CPUPerc;
        ramPoint = value.MemPerc;
      }

      const timeNow = getCurrentDateTime();

      setCPU((prevData: any[]) => [{ ...prevData[0], data: [...prevData[0].data, { x: timeNow, y: cpuPoint }] }]);
      setRAM((prevData: any[]) => [{ ...prevData[0], data: [...prevData[0].data, { x: timeNow, y: ramPoint }] }]);
    }
  };

  // Effect to start fetching container stats
  useEffect(() => {
    if (isStarted) {
      const intervalId = setInterval(fetchAndDisplayResponse1, 1000);
      return () => clearInterval(intervalId);
    }
  }, [isStarted, selectedContainerIndex]);

  // Function to handle container click
  const handleContainerClick = (index: number) => {
    setSelectedContainerIndex(index);
    setCPU([{ id: 'Sample Dataset', data: [] }]);
    setRAM([{ id: 'Sample Dataset', data: [] }]);
    setIsStarted(true);
  };

  // Define an event handler to update the selected memory value when the slider changes
  const handleMemoryChange = (event: any, newValue: any) => {
  setSelectedMemory(newValue); // Update the selected memory value
};


// Trying to change memory, not working so far
// const updateContainerMemoryLimit = async (containerId: string, memoryLimitMb: number) => {
//   const memoryLimit = `${memoryLimitMb}m`; // Convert memory limit to the format expected by Docker (e.g., "512m" for 512 MB)
//   try {
//     await ddClient.docker.cli.exec("update", ["--memory", memoryLimit, containerId]);
//     console.log(`Memory limit updated to ${memoryLimit} for container ${containerId}`);
//   } catch (error) {
//     console.error("Failed to update container memory limit:", error);
//   }
// };

// // Modify the handleMemoryChange function like so:

// const handleMemoryChange = (event: any, newValue: any) => {
//   setSelectedMemory(newValue); // Update the selected memory value

//   if (selectedContainerIndex !== null) {
//     // Call the update function with the selected container's ID and new memory limit
//     const containerId = containerList[selectedContainerIndex];
//     updateContainerMemoryLimit(containerId, newValue);
//   }
// };


// We need to know how much ram the host machine has, try something like this: (this is system dependent, it's different for mac and linux)
// const fetchHostTotalRam = async () => {
//   // Example command for Linux. Adjust based on your target OS.
//   const command = "free -m | awk '/^Mem:/ {print $2}'"; // This gets total RAM in MB
//   try {
//     const result = await ddClient.docker.cli.exec("run", ["--rm", "alpine", "sh", "-c", command]);
//     const totalRamMb = parseInt(result.stdout, 10);
//     console.log(`Total RAM on Host: ${totalRamMb} MB`);
//     return totalRamMb;
//   } catch (error) {
//     console.error("Failed to fetch host total RAM:", error);
//     return 0; // Return 0 or a default value in case of failure
//   }
// };

  // Render components
  return (
    <>
    <Slider
    // could replace some of these vqriables with ones retrieved from commands, should work hopefully
      value={selectedMemory}
      onChange={handleMemoryChange}
      min={128} // Minimum memory value (in MB)
      max={8192} // Maximum memory value (in MB)
      step={128} // Memory increment step (in MB)
      aria-labelledby="memory-slider"
    />
    <h1>{selectedMemory}</h1>



      <Stack direction="row">
        <Container style={{ width: '30vw', height: '80vh', padding: '20px' }} sx={{ mt: 0, mr: 2, bgcolor: blueGrey[50], border: 2, borderColor: 'primary.main', borderRadius: 2 }}>
          <Typography variant="h2">Container List</Typography>
          {containerNamesList.map((container, index) => (
            <Button key={index} onClick={() => handleContainerClick(index)} sx={{ mb: 2 }}>{container}</Button>
          ))}
        </Container>
        <Stack direction="column">
          <Container style={{ width: '60vw', height: '40vh', padding: '20px' }} sx={{ ml: 2, bgcolor: blueGrey[50], border: 2, borderColor: 'primary.main', borderRadius: 2 }}>
            <Typography variant="h2">CPU Percentage</Typography>
            {isStarted && (
              <ResponsiveLine
                data={dataCPU}
                margin={{ top: 0, right: 60, bottom: 125, left: 100 }}
                xScale={{ type: 'point' }}
                yScale={{ type: 'linear', min: 0, max: 'auto', stacked: true, reverse: false }}
                axisBottom={{ legend: 'Time', legendOffset: 60, tickRotation: -45, legendPosition: 'middle', tickValues: dataCPU[0]?.data.filter((_: any, index: number) => index % Math.ceil(dataCPU[0]?.data.length / 7) === 0).map((item: { x: any; }) => item.x) }}
                axisLeft={{ legend: 'Value', legendOffset: -60, legendPosition: 'middle' }}
              />
            )}
          </Container>
          <Container style={{ width: '60vw', height: '40vh', padding: '20px' }} sx={{ ml: 2, bgcolor: blueGrey[50], border: 2, borderColor: 'primary.main', borderRadius: 2 }}>
            <Typography variant="h2">Memory Percentage</Typography>
            {isStarted && (
              <ResponsiveLine
                data={dataRAM}
                margin={{ top: 0, right: 60, bottom: 125, left: 100 }}
                xScale={{ type: 'point' }}
                yScale={{ type: 'linear', min: 0, max: 'auto', stacked: true, reverse: false }}
                axisBottom={{ legend: 'Time', legendOffset: 60, tickRotation: -45, legendPosition: 'middle', tickValues: dataRAM[0]?.data.filter((_: any, index: number) => index % Math.ceil(dataRAM[0]?.data.length / 7) === 0).map((item: { x: any; }) => item.x) }}
                axisLeft={{ legend: 'Value', legendOffset: -60, legendPosition: 'middle' }}
              />
            )}
          </Container> 
        </Stack>
      </Stack>
    </>
  );
}
