import React from 'react';
import Button from '@mui/material/Button';
import { createDockerDesktopClient } from '@docker/extension-api-client';
import { Stack, TextField, Typography  } from '@mui/material';
// import { DataGrid } from '@mui/x-data-grid';
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2


// Note: This line relies on Docker Desktop's presence as a host application.
// If you're running this React app in a browser, it won't work properly.
const client = createDockerDesktopClient();

function useDockerDesktopClient() {
  return client;
}

export function App() {
  const [response, setResponse] = React.useState<string>();
  const ddClient = useDockerDesktopClient();

  const fetchAndDisplayResponse = async () => {

    const result = await ddClient.docker.cli.exec("stats", [
      "--all",
      "--no-stream",
      // "--no-trunc",
      "--format",
      '" json .}}"',
    ]);
    
    // docker run --name <container_name> <image_name></image_name>
    // start a container from the Docker image:

    // docker exec <container_name> ls /


    const result1 = await ddClient.docker.cli.exec("system prune", [
      "--all", 
      "--force",
      // "--no-stream",
      // "--no-trunc",
      // "--format",
      // '" json .}}"',
    ]);

    const statsData = result.parseJsonLines();
    let dataString = ""

    for (const key in statsData) {
      const value = statsData[key];
      dataString += 'Container Name: ' + value.Name + '\n' + 'CPU Usage: ' + value.CPUPerc + '\n' + 'Memory Usage: ' + value.MemPerc + '\n';
    }
      setResponse(dataString)
  };

  // {"stdout":"{\"BlockIO\":\"7.33MB / 4.1kB\",\"CPUPerc\":\"0.00%\",\"Container\":\"772867bb9f60\",\"ID\":\"772867bb9f60\",\"MemPerc\":\"0.19%\",\"MemUsage\":\"14.9MiB / 7.657GiB\",\"Name\":\"gallant_banzai\",\"NetIO\":\"9.5kB / 0B\",\"PIDs\":\"11\"}\n{\"BlockIO\":\"94.7MB / 21.2MB\",\"CPUPerc\":\"0.51%\",\"Container\":\"f5acb0c87304\",\"ID\":\"f5acb0c87304\",\"MemPerc\":\"2.64%\",\"MemUsage\":\"206.7MiB / 7.657GiB\",\"Name\":\"jovial_mccarthy\",\"NetIO\":\"9.19kB / 0B\",\"PIDs\":\"32\"}\n","stderr":""}

  return (
    <>
      


    <Grid  direction={"row"}>
      <Stack
          direction="row"
          justifyContent="center"
          alignItems="center"
          spacing={8}
          sx= {{ pt : 4, pb : 8}}
        >
          <Typography variant="h3">Dockular</Typography>
          <Button>Home</Button>
          <Button>Resource Monitor</Button>
          <Button>Prune</Button>
          
        </Stack>
        <>
        <Typography variant="h3">Content</Typography>
        </>

    </Grid>


      
      {/* <Typography variant="h3">Docker extension demo</Typography> */}
      <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
        This is a basic page rendered with MUI, using Docker's theme. Read the
        MUI documentation to learn more. Using MUI in a conventional way and
        avoiding custom styling will help make sure your extension continues to
        look great as Docker's theme evolves.
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
        Pressing the below button will trigger a request to the backend. Its
        response will appear in the textarea.
      </Typography>
      <Stack direction="row" alignItems="start" spacing={2} sx={{ mt: 4 }}>
        <Button variant="contained" onClick={fetchAndDisplayResponse}>
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
