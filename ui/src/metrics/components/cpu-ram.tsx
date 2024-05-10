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
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';


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
  const [currentContainerName, setCurrentContainerName] = useState<any[]>([]);
  const [containerImageList, setImageList] = useState<any[]>([]);
  const [open, setOpen] = useState(false)

  // Docker desktop client
  const ddClient = useDockerDesktopClient();

  // Effect to fetch container list
  useEffect(() => {
    if (!containerList[0]) {
      ddClient.docker.cli.exec("ps", ["--all", "--format", '"{{json .}}"']).then((result) => {
        const statsContainerData = result.parseJsonLines();
        const containerArray = [];
        const namesList = [];
        const imageList = [];
        for (const key in statsContainerData) {
          const value = statsContainerData[key];
          containerArray.push(value.ID);
          namesList.push(value.Image);
          imageList.push(value.Names);
        }
        setContainerList(containerArray);
        setContainerNamesList(namesList);
        setImageList(imageList);
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
    setCurrentContainerName(containerNamesList[index])
    setCPU([{ id: 'Sample Dataset', data: [] }]);
    setRAM([{ id: 'Sample Dataset', data: [] }]);
    setIsStarted(true);
  };

  // Define an event handler to update the selected memory value when the slider changes
//   const handleMemoryChange = (event: any, newValue: any) => {
//   setSelectedMemory(newValue); // Update the selected memory value
// };
const handleOpen = () => {
  setOpen(true);
};

const handleClose = () => {
  setOpen(false);
};

const updateContainerMemoryLimit = async (memoryLimitMb: number) => {
  
  setOpen(false)
  const memoryLimit = '"'+memoryLimitMb+'m"'; // Convert memory limit to the format expected by Docker (e.g., "512m" for 512 MB)

    if (selectedContainerIndex !== null) {
      let containerId = containerNamesList[selectedContainerIndex];
      // await ddClient.docker.cli.exec(`container`, ['stop', containerId]);
      // Step 1: Run new container with updated memory limit
      await ddClient.docker.cli.exec(`run --memory=${memoryLimit} ${containerId}`, [])   
      
      // Step 2: Remove the original container
      // await ddClient.docker.cli.exec(`stop ${containerId}`, [])   
      // await ddClient.docker.cli.exec(`container rm ${containerId}`, [])   
      // await ddClient.docker.cli.exec("stop", containerId);
      // await ddClient.docker.cli.exec("stop", [containerId]);
      // await ddClient.docker.cli.exec("container rm", [containerId]);
      // await ddClient.docker.cli.exec("stop", containerId);
      // await ddClient.docker.cli.exec(`stop`, [containerId]);
  }

};


// const testingfunction = async () => {
//   setOpen(false)
//   if (selectedContainerIndex !== null) {
//     let containerId = containerNamesList[selectedContainerIndex];
//     await ddClient.docker.cli.exec("container", ["stop", containerId]);
//     // await ddClient.docker.cli.exec("container stop", [containerId]);
//     // await ddClient.docker.cli.exec(`container stop ${containerId}`, []);
//   }
// }

// Fetch container list function
// const fetchContainerList = async () => {
//   const result = await ddClient.docker.cli.exec("ps", ["--all", "--format", '{{json .}}']);
//   const statsContainerData = result.parseJsonLines();
//   const containerArray = statsContainerData.map(container => container.ID);
//   const namesList = statsContainerData.map(container => container.Names);
//   const imageList = statsContainerData.map(container => container.Image);

//   setContainerList(containerArray);
//   setContainerNamesList(namesList);
//   setImageList(imageList);
// };


// state to refresh container list
const [refreshTrigger, setRefreshTrigger] = useState(false);

useEffect(() => {
  const fetchContainerList = async () => {
    const result = await ddClient.docker.cli.exec("ps", ["--all", "--format", '"{{json .}}"']);
    const statsContainerData = result.parseJsonLines();
    const containerArray = [];
    const namesList = [];
    const imageList = [];
    for (const key in statsContainerData) {
      const value = statsContainerData[key];
      containerArray.push(value.ID);
      namesList.push(value.Image);
      imageList.push(value.Names);
    }
    setContainerList(containerArray);
    setContainerNamesList(namesList);
    setImageList(imageList);
  };
  fetchContainerList();  // Initial fetch

  const intervalId = setInterval(fetchContainerList, 1000);  // Refresh every 1000 ms

  return () => clearInterval(intervalId);  // Clean up interval on component unmount
}, []);

// // Triggering a refresh by altering state
// const triggerRefresh = () => {
//   setRefreshTrigger(!refreshTrigger);
// };



// Modify the handleMemoryChange function like so:
const handleMemoryChange = (event: any, newValue: any) => {                                                                                                                        
  setSelectedMemory(newValue); // Update the selected memory value

  // if (selectedContainerIndex !== null) {
  //   // Call the update function with the selected container's ID and new memory limit
  //   const containerId = containerList[selectedContainerIndex];
  //   updateContainerMemoryLimit(containerId, newValue);
  // }
};

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
      <Stack direction="row">
        <Container style={{ width: '30vw', height: '80vh', padding: '20px' }} sx={{ mb:2, mt: 0, mr: 2, bgcolor: blueGrey[50], border: 2, borderColor: 'primary.main', borderRadius: 2 }}>
          {/* Maybe you can make this always refresh every 1 second? */}
          <Typography variant="h2">Container List</Typography>
          {containerNamesList.map((container, index) => (
            <Button key={index} onClick={() => handleContainerClick(index)} sx={{ mb: 2 }}>{container}</Button>
          ))}

        </Container>
        <Stack direction="column">
          <Container style={{ width: '60vw', height: '40vh', padding: '20px' }} sx={{ ml: 2, bgcolor: blueGrey[50], border: 2, borderColor: 'primary.main', borderRadius: 2 }}>
          <h2>{currentContainerName} - CPU Percentage</h2>
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
          <Container style={{ width: '60vw', height: '60vh', padding: '20px' }} sx={{ ml: 2, bgcolor: blueGrey[50], border: 2, borderColor: 'primary.main', borderRadius: 2 }}>
            <h2>{currentContainerName} - Memory Percentage</h2>
            {isStarted && (
              <>
              <div style={{ width: '100%', height: '60%'}}>
              <ResponsiveLine
                data={dataRAM}
                margin={{ top: 10, right: 60, bottom: 50, left: 100 }}
                xScale={{ type: 'point' }}
                yScale={{ type: 'linear', min: 0, max: 'auto', stacked: true, reverse: false }}
                axisBottom={{ legend: 'Time', legendOffset: 60, tickRotation: -45, legendPosition: 'middle', tickValues: dataRAM[0]?.data.filter((_: any, index: number) => index % Math.ceil(dataRAM[0]?.data.length / 7) === 0).map((item: { x: any; }) => item.x) }}
                axisLeft={{ legend: 'Value', legendOffset: -60, legendPosition: 'middle' }} 
                />
              </div>
              <hr style={{ border: 'none', borderBottom: '1px dashed #aaa' }} />
              <div>
                <h4>{selectedMemory}</h4>
                <Slider
                  // could replace some of these vqriables with ones retrieved from commands, should work hopefully
                  value={selectedMemory}
                  onChange={handleMemoryChange}
                  min={128} // Minimum memory value (in MB)
                  max={8192} // Maximum memory value (in MB)
                  step={128} // Memory increment step (in MB)
                  aria-labelledby="memory-slider" 
                  />
                  <Button onClick={handleOpen}>
                    Set Memory Limit
                  </Button>
                  {/* <Button onClick={()=> testingfunction}>
                        testing
                      </Button> */}
                  <Dialog open={open} onClose={handleClose}>
                    <DialogTitle>Are you sure?</DialogTitle>
                      <DialogContent>
                        <DialogContentText>
                          This action will terminate and prune the selected container/image. A new container/image will be pulled with the chosen memory limit. 
                        </DialogContentText>
                      </DialogContent>
                    <DialogActions>
                      <Button onClick={handleClose}>
                        Cancel
                      </Button>
                      <Button onClick={()=> updateContainerMemoryLimit(selectedMemory)} autoFocus>
                        Confirm
                      </Button>
                    </DialogActions>
                  </Dialog>
                </div>
                  </>
            )}
          </Container> 
        </Stack>
      </Stack>
    </>
  );
}
