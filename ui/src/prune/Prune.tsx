
// ui/src/App.tsx
import React, { useEffect } from 'react';
import Button from '@mui/material/Button';


import {
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  TextField
} from "@mui/material";

import { createDockerDesktopClient } from "@docker/extension-api-client";
//obtain docker destkop extension client
const ddClient = createDockerDesktopClient();

export function Prune(){

    const [containers, setContainers] = React.useState<any[]>([]);
    const [response, setResponse] = React.useState<string>();

 useEffect(() => {
    // List all containers
    ddClient.docker.cli.exec('ps', ['--all', '--format', '"{{json .}}"', '--filter', "status=exited"]).then((result) => {
      // result.parseJsonLines() parses the output of the command into an array of objects
      setContainers(result.parseJsonLines());
    });
  }, []);


const fetchAndDisplayResponse = async () => {
  // ddClient.docker.cli.exec('ps', ['--all', '--format', '"{{json .}}"', '--filter', "status=exited"])
  // .then((result) => {
  //   const jsonRes = JSON.stringify(result);
  //     setResponse(jsonRes);
  // })
  ddClient.docker.cli.exec('images', ['--format', '"{{json .}}"', '--filter', "dangling=true"])
        .then((result) => {
          const jsonRes = JSON.stringify(result);
              setResponse(jsonRes);
        });
}

useEffect(() => {
  // List containers
  //   ddClient.docker.cli.exec('ps', ['--all', '--format', '"{{json .}}"', '--filter', "status=exited"])
  // .then((result) => {
  //   const jsonRes = JSON.stringify(result);
  //     setResponse(jsonRes);
  // })

  //list images
  ddClient.docker.cli.exec('ps', ['--all', '--format', '"{{json .}}"', '--filter', "status=exited"]).then((result) => {
    // result.parseJsonLines() parses the output of the command into an array of objects
    setContainers(result.parseJsonLines());
  });
}, []);


  return (
    <Stack>
      <Typography data-testid="heading" variant="h3" role="title">
        Container list
      </Typography>
      <Typography
      data-testid="subheading"
      variant="body1"
      color="text.secondary"
      sx={{ mt: 2 }}
    >
      Simple list of containers using Docker Extensions SDK.
      </Typography>
      <TableContainer sx={{mt:2}}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Status</TableCell>
              <TableCell>ID</TableCell>
              <TableCell>Size</TableCell>
              <TableCell>Running For</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {containers.map((container) => (
              <TableRow
                key={container.Id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell>{container.Status}</TableCell>
                 <TableCell>{container.ID}</TableCell>
                <TableCell>{container.Size}</TableCell>
                <TableCell>{container.RunningFor}</TableCell>
              </TableRow>
            ))}
            {containers.map((container) => (
              <TableRow
                key={container.Id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell>{container.Id}</TableCell>
                 {/* <TableCell>{container.ParentId}</TableCell>
                <TableCell>{container.Labels}</TableCell>
                <TableCell>{container.Containers}</TableCell> */}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
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
    </Stack>    
    
  );
}