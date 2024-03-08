import React from 'react';
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


export function Metrics() {
  const [response, setResponse1] = React.useState<string>();
  const ddClient = useDockerDesktopClient();
  
  const data = [
    {
      id: 'Sample Dataset',
      data: [
        { x: 'January', y: 65 },
        { x: 'February', y: 59 },
        { x: 'March', y: 80 },
        { x: 'April', y: 81 },
        { x: 'May', y: 56 },
        { x: 'June', y: 55 },
        { x: 'July', y: 40 },
      ],
    },
  ];




  const fetchAndDisplayResponse1 = async () => {

    const result = await ddClient.docker.cli.exec("stats", [
      "--all",
      "--no-stream",
      // "--no-trunc",
      "--format",
      '" json .}}"',
    ]);
    

    const statsData = result.parseJsonLines();
    let dataString = ""

    for (const key in statsData) {
      const value = statsData[key];
      dataString += 'Container Name: ' + value.Name + '\n' + 'CPU Usage: ' + value.CPUPerc + '\n' + 'Memory Usage: ' + value.MemPerc + '\n';
    }
      setResponse1(dataString)
  };


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
          data={data}
          margin={{ top: 0, right: 100, bottom: 100, left: 100 }}
          xScale={{ type: 'point' }}
          yScale={{ type: 'linear', min: 'auto', max: 'auto', stacked: true, reverse: false }}
          axisBottom={{
            legend: 'Month',
            legendOffset: 36,
            legendPosition: 'middle',
          }}
          axisLeft={{
            legend: 'Value',
            legendOffset: -40,
            legendPosition: 'middle',
          }}
          />
    </Paper>
    </Stack>
      
      <Stack direction="row" alignItems="start" spacing={2} sx={{ mt: 4 }}>
        <Button variant="contained" onClick={fetchAndDisplayResponse1}>
          Call backend
        </Button>

        <TextField
          label="Backend response"
          sx={{ width: 480 }}
          disabled
          multiline
          variant="outlined"
          minRows={5}
          value={response ?? ''}
        />
      </Stack>
    
    </>
  );
}
