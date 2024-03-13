import React from 'react';
import { Link } from "react-router-dom"
import { Route, Routes } from "react-router"
import Button from '@mui/material/Button';
import { createDockerDesktopClient } from '@docker/extension-api-client';
import { Divider, Stack, TextField, Typography } from '@mui/material';
import { Metrics } from "./metrics/components/cpu-ram"


// Note: This line relies on Docker Desktop's presence as a host application.
// If you're running this React app in a browser, it won't work properly.



const App = () => {
  // {"stdout":"{\"BlockIO\":\"7.33MB / 4.1kB\",\"CPUPerc\":\"0.00%\",\"Container\":\"772867bb9f60\",\"ID\":\"772867bb9f60\",\"MemPerc\":\"0.19%\",\"MemUsage\":\"14.9MiB / 7.657GiB\",\"Name\":\"gallant_banzai\",\"NetIO\":\"9.5kB / 0B\",\"PIDs\":\"11\"}\n{\"BlockIO\":\"94.7MB / 21.2MB\",\"CPUPerc\":\"0.51%\",\"Container\":\"f5acb0c87304\",\"ID\":\"f5acb0c87304\",\"MemPerc\":\"2.64%\",\"MemUsage\":\"206.7MiB / 7.657GiB\",\"Name\":\"jovial_mccarthy\",\"NetIO\":\"9.19kB / 0B\",\"PIDs\":\"32\"}\n","stderr":""}
  const client = createDockerDesktopClient();

  function useDockerDesktopClient() {
    return client;
  }
    const [response, setResponse] = React.useState<string>();
    const ddClient = useDockerDesktopClient();
  
    const fetchAndDisplayResponse = async () => {

    const result = await ddClient.docker.cli.exec("stats 47b1c424f4a6", [
      "--no-stream",
      // "--no-trunc",
      "--format",
      '"{{json .}}"',
    ]);

      setResponse(JSON.stringify(result))
  };

  return (
    <>
      <Stack
        direction="row"
        justifyContent="center"
        alignItems="center"
        spacing={8}
        sx= {{ pt : 4, pb : 8}}
      >
        <Typography variant="h3">Dockular</Typography>
        <Button variant="contained">Home</Button>

        <Button variant="contained">
          <Link to = {'/metrics'}> 
            {'Metrics'}
          </Link>
        </Button>

        <Button variant="contained">
          <Link to = {'/prune'}> 
            {'Prune'}
          </Link>
        </Button>

      </Stack>
      <Routes>
        <Route path ="/metrics" element = {<Metrics />}/>
        {/* <Route path ="/prune" element = {< />}/> */}
      </Routes>

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
          ></TextField>
    </>
  );
}

export {App}
