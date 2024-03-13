import React, { useState, useEffect } from 'react';
import { Paper } from '@mui/material';
import { ResponsiveLine } from '@nivo/line';
import Button from '@mui/material/Button';
import { createDockerDesktopClient } from '@docker/extension-api-client';
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
  const [containerList, setContainerList] = useState<any[]>([]);
  

  const [selectedContainerIndex, setSelectedContainerIndex] = useState<number | null>(null); 
  // selectedContainerIndex: state variable which holds the index of the currently selected container in the list of containers

  // useState<number | null>(null): initializes the state variable selectedContainerIndex which accepts two types, number and null (Initially set to null) 

  // setSelectedContainerIndex: Setter function that you'll use to update the selectedContainerIndex state variable. (call setSelectedContainerIndex(index) to update selectedContainerIndex with provided index value, do so with handleContainerClick)
  
  const ddClient = useDockerDesktopClient();
  
  let data : any = [
    {
      id: 'Sample Dataset',
      data: [],
    },
  ];

  
  useEffect(()=>{
    if (!containerList[0]) ddClient.docker.cli.exec("stats", [
      "--all",
      "--no-stream",
      "--format",
      '"{{json .}}"',
    ]).then((result) => {
      const statsContainerData = result.parseJsonLines();
      const containerArray = [];
      for (const key in statsContainerData) {
        const value = statsContainerData[key];
        containerArray.push(value.Name)
      }
      setContainerList(containerArray)
    });
  },[containerList])


  const fetchAndDisplayResponse1 = async () => {
    if (selectedContainerIndex !== null) { // Check if a container is selected
      const result = await ddClient.docker.cli.exec("stats", [
        containerList[selectedContainerIndex], // Pass selected container name
        "--no-stream",
        "--format",
        '"{{json .}}"',
      ]);

      const statsData = result.parseJsonLines();
      let dataPoint: any;

      for (const key in statsData) {
        const value = statsData[key];
        dataPoint = value.CPUPerc;
      }

      let timeNow = getCurrentDateTime();

      data[0].data.push({ x: timeNow , y: dataPoint})
      setCPU((prevData: any[]) => [
        {
          ...prevData[0],
          data: [...prevData[0].data, { x: timeNow, y: dataPoint }],
        },
      ]);
    }
  };

  useEffect(() => {
    if(isStarted) {
      const intervalId = setInterval(fetchAndDisplayResponse1, 5000);
      return () => clearInterval(intervalId);
    }
  }, [isStarted, selectedContainerIndex]); // Adding selectedContainerIndex as a dependency in order to use this variable
  
  const handleClick = () => {
    setIsStarted(true);
  };

  // handleclick for container list
  const handleContainerClick = (index: number) => {
    setSelectedContainerIndex(index); // Set selected container index
  };

  return (
    <>
      <Stack direction="row">
        <Paper style={{ width: '250px', height: '400px', padding: '20px' }} sx={{ mt: 0, mr: 2}}>
          <h2>Container List</h2>
          {containerList.map((container, index) => (
            <Button sx = {{mb:2}} key={index} onClick={() => handleContainerClick(index)}>{container}</Button>
          ))} {/* addding handleContainerClick as onclick, passing in index */}
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
              tickRotation: -45, 
              legendPosition: 'middle',
              tickValues: dataCPU[0]?.data
                .filter((_: any, index: number) => index % Math.ceil(dataCPU[0]?.data.length / 7) === 0)
                .map((item: { x: any; }) => item.x),
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
