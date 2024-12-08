// Commands to build and update extension:
  // docker build --tag=dockular/my-extension:latest .
  // docker extension update dockular/my-extension:latest

// Import React hooks and components
import Slider from '@mui/material/Slider';
import React, { useState, useEffect } from 'react';
import { Paper, Button, Container, Stack, Box, Typography } from '@mui/material';
import { ResponsiveLine } from '@nivo/line';
import { createDockerDesktopClient } from '@docker/extension-api-client';
import { blueGrey } from '@mui/material/colors';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Modal from '@mui/material/Modal';

import useMediaQuery from '@mui/material/useMediaQuery';
import { createTheme } from '@mui/material';


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
export function MetricsSection() {
  // State variables

  //TYPES: 
  type DataCPUType = {
    'id': string,
    'data': {x:number, y:number}[]
  }[];

   type DataRAMType = {
    'id': string,
    'data': {x:number, y:number}[]
  }[];

  const [dataCPU, setCPU] = useState<DataCPUType>([ { id: 'Sample Dataset', data: [{ x: 0, y: 0 }] } ]);
  const [dataRAM, setRAM] = useState<DataRAMType>([{ id: 'Sample Dataset', data: [{ x: 0, y: 0 }] }]);
  const [isStarted, setIsStarted] = useState<boolean>(false);
  const [containerList, setContainerList] = useState<string[]>([]);
  const [containerNamesList, setContainerNamesList] = useState<string[][]>([]);
  const [selectedContainerIndex, setSelectedContainerIndex] = useState<number | null>(null); 
  const [selectedMemory, setSelectedMemory] = useState<number>(512); // Initial value is 512 MB
  const [currentContainerName, setCurrentContainerName] = useState<string[]>([]);
  const [containerImageList, setImageList] = useState<string[]>([]);
  const [open, setOpen] = useState<boolean>(false)

  // Docker desktop client
  const ddClient = useDockerDesktopClient();

  // Effect to fetch container list
  useEffect(() => {

    // console.log('containerList', containerList)

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

  // useEffect(()=>{
  //   console.log('containerNamesList', containerNamesList)
  // },[containerNamesList])

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
      let containerName = containerNamesList[selectedContainerIndex];
      let containerId = containerList[selectedContainerIndex];

      // await ddClient.docker.cli.exec(`container`, ['stop', containerId]);
      // Step 1: Run new container with updated memory limit
      await ddClient.docker.cli.exec(`stop`, [containerId])
      await ddClient.docker.cli.exec(`rm`, [containerId, '-f'])
      await ddClient.docker.cli.exec(`run --memory=${memoryLimit} ${containerName}`, [])
      

  }

};


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

//MODEL
const [modelOpen, setModelOpen] = React.useState(false);
const handleModelOpen = () => setModelOpen(true);
const handleModelClose = () => setModelOpen(false);
//MODEL STYLE
const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
  borderColor: 'primary.main'
};

//MUI MEDIA QUERIES
const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 875,
      lg: 1200,
      xl: 1536,
    },
  },
});
 const matches = useMediaQuery(theme.breakpoints.up('md'));



  // Render components
  return (
    <>
      <Container
            sx={{
                width: '95vw', 
                height: '85vh',
                bgcolor: blueGrey[50],
                display: 'flex',
                flexDirection: 'row',
                border:2,
                borderColor:'primary.main'
            }}>

        <Box sx={{width:'275px', height:'100%', m:2}}>
        {/* <Container style={{ width: '30vw', height: '80vh', padding: '20px' }} sx={{ mb:2, mt: 0, mr: 2, bgcolor: blueGrey[50], border: 2, borderColor: 'primary.main', borderRadius: 2 }}> */}
        <Container 
          sx={{ bgcolor: blueGrey[50], 
          border: 2, 
          borderColor: 'primary.main', 
          borderRadius: 2, 
          height: '95%' , 
          display: 'flex', 
          flexDirection: 'column',
          overflow: 'scroll'
          }}>

          {/* Maybe you can make this always refresh every 1 second? */}
          <Box sx={{
                  color: 'primary.main',
                  fontWeight: 'bold',
                  fontStyle: 'italic',
                  textAlign: 'center',
                  marginTop: 1,
                   
                }}>Container List</Box>
          {containerNamesList.map((container, index) => (
            <Button key={index} onClick={() => handleContainerClick(index)} sx={{ mb: 2 }}>{container}</Button>
          ))}

        </Container>
        </Box>

    
          <Box sx={{width: matches === true ? '70%' : '50%', height:'95%', m:2, display: 'flex', flexDirection:'column', justifyContent:'space-between'}}>
          {/* <Container style={{ width: '60vw', height: '40vh', padding: '20px' }} sx={{ ml: 2, bgcolor: blueGrey[50], border: 2, borderColor: 'primary.main', borderRadius: 2 }}> */}
          <Container sx={{  bgcolor: blueGrey[50], border: 2, borderColor: 'primary.main', borderRadius: 2, height: '45%'}}>
          <Box sx={{
                  color: 'primary.main',
                  fontWeight: 'bold',
                  fontStyle: 'italic',
                  textAlign: 'center',
                  marginTop: 1,
                   
                }}>{`${currentContainerName} -`}  CPU Percentage
               
              </Box>

            {isStarted && (
              <ResponsiveLine
              data={dataCPU}
              // margin={{ top: 5, right: 20, bottom: 110, left: 85 }}
                           margin={{ top: 5, right: 20, bottom: 110, left: 85 }}

              xScale={{ type: 'point' }}
              yScale={{ type: 'linear', min: 0, max: 'auto', stacked: true, reverse: false }}
              axisBottom={{ legend: '', legendOffset: 60, tickRotation: -45, legendPosition: 'middle', tickValues: dataCPU[0]?.data.filter((_: any, index: number) => index % Math.ceil(dataCPU[0]?.data.length / 7) === 0).map((item: { x: any; }) => item.x) }}
              axisLeft={{ legend: 'Value', legendOffset: -60, legendPosition: 'middle' }}
              />
            )}
          </Container>



          {/* <Container style={{ width: '60vw', height: '60vh', padding: '20px' }} sx={{ ml: 2, bgcolor: blueGrey[50], border: 2, borderColor: 'primary.main', borderRadius: 2 }}> */}
          <Container sx={{ bgcolor: blueGrey[50], border: 2, borderColor: 'primary.main', borderRadius: 2, height: '50%', display:'flex', flexDirection:'column',alignItems:'center', justifyContent:'space-between'}}>

          <Box sx={{
                  color: 'primary.main',
                  fontWeight: 'bold',
                  fontStyle: 'italic',
                  textAlign: 'center',
                  marginTop: 1,
                   
                }}>{`${currentContainerName} -`}  Memory Percentage
            </Box>
            
            {isStarted && (
              <>
              <Box style={{ width: '100%', height: '60%'}}>
              <ResponsiveLine
                data={dataRAM}
                // margin={{ top: 10, right: 20, bottom: 65, left: 85 }}
                margin={{ top: 11, right: 60, bottom: 42, left: 100 }}

                xScale={{ type: 'point' }}
                yScale={{ type: 'linear', min: 0, max: 'auto', stacked: true, reverse: false }}
                axisBottom={{ legend: '', legendOffset: 60, tickRotation: -45, legendPosition: 'middle', tickValues: dataRAM[0]?.data.filter((_: any, index: number) => index % Math.ceil(dataRAM[0]?.data.length / 7) === 0).map((item: { x: any; }) => item.x) }}
                axisLeft={{ legend: 'Value', legendOffset: -60, legendPosition: 'middle' }} 
                />

              </Box>
              {/* <hr style={{ border: 'none', borderBottom: '1px dashed #aaa' }} /> */}
              

                  </>
            )}
           
            <Button  onClick={()=>{handleModelOpen()}} variant="contained" color='error' sx={{width:'90%', height:'20px'}} style={{marginTop:1, marginBottom:10}}>Set Memory Limit</Button>
            
<Modal
 open={modelOpen}
 onClose={()=>{handleModelClose()}}
 aria-labelledby="modal-modal-title"
 aria-describedby="modal-modal-description"
>
 <Box sx={style}>
 <div>
<h4>{`${selectedMemory} MB`}</h4>
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
   Set Memory Limit - β
 </Button>
 {/* <Button onClick={()=> testingfunction}>
       testing
     </Button> */}
 <Dialog open={open} onClose={handleClose}>
   <DialogTitle>Are you sure?</DialogTitle>
     <DialogContent>
       <DialogContentText>
         This action will pause the visual graphs, terminate, and prune the selected container/image. A new container/image will be pulled with the chosen memory limit.
       </DialogContentText>
     </DialogContent>
   <DialogActions>
     <Button onClick={handleClose}>
       Cancel
     </Button>
     
     <Button onClick={()=> {updateContainerMemoryLimit(selectedMemory), handleModelClose()}} autoFocus>
       Confirm
     </Button>
   </DialogActions>
 </Dialog>
</div>
 </Box>
</Modal>

          </Container> 
          </Box>
          </Container> 
       
    </>
  );
}
