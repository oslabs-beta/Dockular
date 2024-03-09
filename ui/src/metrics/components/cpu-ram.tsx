import React, { useState, useEffect } from 'react';
import { Paper } from '@mui/material';
import { ResponsiveLine } from '@nivo/line';
import Button from '@mui/material/Button';
import { createDockerDesktopClient } from '@docker/extension-api-client';
import Chart from 'chart.js';
import { Divider, Stack, TextField, Typography } from '@mui/material';


const client = createDockerDesktopClient();

function useDockerDesktopClient() {
  return client;
}

function getCurrentDateTime() {
  const currentDate = new Date();
  const hours = currentDate.getHours().toString().padStart(2, '0');
  const minutes = currentDate.getMinutes().toString().padStart(2, '0');
  const seconds = currentDate.getSeconds().toString().padStart(2, '0');
  
  return `${hours}:${minutes}:${seconds}`;
}


export function Metrics() {
  const [dataCPU, setCPU] = React.useState<any>([
    {
      id: 'Sample Dataset',
      data: [
        { x: 0, y: 0 }
      ],
    },
  ]);
  const [isStarted, setIsStarted] = useState(false);
  
  const ddClient = useDockerDesktopClient();
  
  let data : any = [
    {
      id: 'Sample Dataset',
      data: [],
    },
  ];

  const fetchAndDisplayResponse1 = async () => {

    const result = await ddClient.docker.cli.exec("stats", [
      "--all",
      "--no-stream",
      "--format",
      '"{{json .}}"',
    ]);
    

    const statsData = result.parseJsonLines();
    let dataPoint: any

    for (const key in statsData) {
      const value = statsData[key];
      dataPoint = value.CPUPerc
    }

    let timeNow = getCurrentDateTime();

    data[0].data.push({ x: timeNow , y: dataPoint})
    setCPU((prevData: any[]) => [
      {
        ...prevData[0],
        data: [...prevData[0].data, { x: timeNow, y: dataPoint }],
      },
    ]);

  };

  useEffect(() => {
    if(isStarted) {
      const intervalId = setInterval(fetchAndDisplayResponse1, 5000);
    return () => clearInterval(intervalId);
    }
    }, [isStarted]);
  
  const handleClick = () => {
    setIsStarted(true);
  };

  // const handleClick = () => {
  //   setInterval(fetchAndDisplayResponse1, 5000);
    
  // };

//   async function handleClick() {
//     try {
//         setInterval(fetchAndDisplayResponse1, 5000);
//     } catch (error) {
//         console.error('Error fetching data:', error);
//     }
// }
  
  // {"stdout":"{\"BlockIO\":\"7.33MB / 4.1kB\",\"CPUPerc\":\"0.00%\",\"Container\":\"772867bb9f60\",\"ID\":\"772867bb9f60\",\"MemPerc\":\"0.19%\",\"MemUsage\":\"14.9MiB / 7.657GiB\",\"Name\":\"gallant_banzai\",\"NetIO\":\"9.5kB / 0B\",\"PIDs\":\"11\"}\n{\"BlockIO\":\"94.7MB / 21.2MB\",\"CPUPerc\":\"0.51%\",\"Container\":\"f5acb0c87304\",\"ID\":\"f5acb0c87304\",\"MemPerc\":\"2.64%\",\"MemUsage\":\"206.7MiB / 7.657GiB\",\"Name\":\"jovial_mccarthy\",\"NetIO\":\"9.19kB / 0B\",\"PIDs\":\"32\"}\n","stderr":""}

  return (
    <>
    <Stack direction="row">
    <Paper style={{ width: '150px', height: '400px', padding: '20px' }} sx={{ mt: 0, mr: 2}}>
      <h2>Container List</h2>
    </Paper>
    <Paper style={{ width: '700px', height: '600px', padding: '20px' }} sx={{ ml: 2}}>
      <h2>Line Chart</h2>
      <ResponsiveLine
          data={dataCPU}
          margin={{ top: 0, right: 100, bottom: 100, left: 100 }}
          xScale={{ type: 'point' }}
          yScale={{ type: 'linear', min: 0, max: 'auto', stacked: true, reverse: false }}
          axisBottom={{
            legend: 'Time',
            legendOffset: 60,
            tickValues : 10, 
            tickRotation: -45, 
            legendPosition: 'middle',
          }}
          axisLeft={{
            legend: 'Value',
            legendOffset: -60,
            legendPosition: 'middle',
          }}
          />
    </Paper>
    </Stack>
      
      <Stack direction="row" alignItems="start" spacing={2} sx={{ mt: 4 }}>
        <Button variant="contained" onClick={handleClick}>
          Call backend
        </Button>

      </Stack>
    
    </>
  );
}