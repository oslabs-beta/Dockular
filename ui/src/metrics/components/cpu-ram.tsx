import React, { useState, useEffect } from 'react';
import { Paper } from '@mui/material';
import { ResponsiveLine } from '@nivo/line';
import Button from '@mui/material/Button';
import { createDockerDesktopClient } from '@docker/extension-api-client';
import { Container, Stack, Typography } from '@mui/material';
import { blueGrey, red} from '@mui/material/colors';

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
  const [dataRAM, setRAM] = React.useState<any>([
    {
      id: 'Sample Dataset',
      data: [
        { x: 0, y: 0 }
      ],
    },
  ]);

  const [isStarted, setIsStarted] = useState(false);
  const [containerList, setContainerList] = useState<any[]>([]);
  const [containerNamesList, setContainerNamesList] = useState<any[]>([]);
  

  const [selectedContainerIndex, setSelectedContainerIndex] = useState<number | null>(null); 
  // selectedContainerIndex: state variable which holds the index of the currently selected container in the list of containers

  // useState<number | null>(null): initializes the state variable selectedContainerIndex which accepts two types, number and null (Initially set to null) 

  // setSelectedContainerIndex: Setter function that you'll use to update the selectedContainerIndex state variable. (call setSelectedContainerIndex(index) to update selectedContainerIndex with provided index value, do so with handleContainerClick)
  
  const ddClient = useDockerDesktopClient();
  
  let CPUData : any = [
    {
      id: 'Sample Dataset',
      data: [],
    },
  ];

  let RAMData : any = [
    {
      id: 'Sample Dataset',
      data: [],
    },
  ];

  
  useEffect(()=>{
    if (!containerList[0]) ddClient.docker.cli.exec("ps", [
      "--all",
      "--format",
      '"{{json .}}"',
    ]).then((result) => {
      const statsContainerData = result.parseJsonLines();
      const containerArray = [];
      for (const key in statsContainerData) {
        const value = statsContainerData[key];
        containerArray.push(value.ID)
        containerNamesList.push(value.Image)
      }
      setContainerList(containerArray)
      setContainerNamesList(containerNamesList)
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
      let cpuPoint: any = 0;
      let ramPoint: any = 0;

      for (const key in statsData) {
        const value = statsData[key];
        cpuPoint = value.CPUPerc;
        ramPoint = value.MemPerc;
      }

      let timeNow = getCurrentDateTime();

      CPUData[0].data.push({ x: timeNow , y: cpuPoint})
      
      setCPU((prevData: any[]) => [
        {
          ...prevData[0],
          data: [...prevData[0].data, { x: timeNow, y: cpuPoint }],
        },
      ]);

      RAMData[0].data.push({ x: timeNow , y: ramPoint})
      
      setRAM((prevData: any[]) => [
        {
          ...prevData[0],
          data: [...prevData[0].data, { x: timeNow, y: ramPoint }],
        },
      ]);

      
    }
  };

  useEffect(() => {
    if(isStarted) {
      const intervalId = setInterval(fetchAndDisplayResponse1, 1000);
      return () => clearInterval(intervalId);
    }
  }, [isStarted, selectedContainerIndex]); // Adding selectedContainerIndex as a dependency in order to use this variable
  
  // const handleClick = () => {
  // };
  
  // handleclick for container list
  const handleContainerClick = (index: number) => {
    setSelectedContainerIndex(index); // Set selected container index
    setCPU([
      {
        id: 'Sample Dataset',
        data: [],
      },
    ])
    setRAM([
      {
        id: 'Sample Dataset',
        data: [],
      },
    ])
    setIsStarted(true);
  };

  return (
    <>
      <Stack direction="row">
        <Container style={{ width: '30vw', height: '80vh', padding: '20px' }} sx={{ 
          mt: 0, 
          mr: 2,
          bgcolor: blueGrey[50],
          border:2,
          borderColor:'primary.main',
          borderRadius:2
          }}>
          <h2>Container List</h2>
          {containerNamesList.map((container, index) => (
            <Button sx = {{mb:2}} key={index} onClick={() => handleContainerClick(index)}>{container}</Button>
          ))} {/* addding handleContainerClick as onclick, passing in index */}
        </Container>
        <Stack direction="column">
        <Container style={{ width: '60vw', height: '40vh', padding: '20px' }} sx={{ 
          ml: 2,
          bgcolor: blueGrey[50],
          border:2,
          borderColor:'primary.main',
          borderRadius:2,
          }}>
          <h2>CPU Percentage</h2>
          {/* using boolean operator, if isStarted is true, what's after && will render */}
          {isStarted && (
          <ResponsiveLine
            data={dataCPU}
            margin={{ top: 0, right: 60, bottom: 125, left: 100 }}
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
          )}
        </Container>
          
        <Container style={{ width: '60vw', height: '40vh', padding: '20px' }} sx={{ 
          ml: 2,
          bgcolor: blueGrey[50],
          border:2,
          borderColor:'primary.main',
          borderRadius:2,
          }}>
          <h2>Memory Percentage</h2>
          {/* using boolean operator, if isStarted is true, what's after && will render */}
          {isStarted && (
          <ResponsiveLine
            data={dataRAM}
            margin={{ top: 0, right: 60, bottom: 125, left: 100 }}
            xScale={{ type: 'point' }}
            yScale={{ type: 'linear', min: 0, max: 'auto', stacked: true, reverse: false }}
            axisBottom={{
              legend: 'Time',
              legendOffset: 60,
              tickRotation: -45, 
              legendPosition: 'middle',
              tickValues: dataRAM[0]?.data
                .filter((_: any, index: number) => index % Math.ceil(dataRAM[0]?.data.length / 7) === 0)
                .map((item: { x: any; }) => item.x),
            }}
            axisLeft={{
              legend: 'Value',
              legendOffset: -60,
              legendPosition: 'middle',
            }}
          />
          
          )}
        </Container> 
        </Stack>
      </Stack>
    </>
  );
}
