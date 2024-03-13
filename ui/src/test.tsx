import React, {useEffect} from 'react';
import Button from '@mui/material/Button';
import { createDockerDesktopClient } from '@docker/extension-api-client';
import { Box, Container } from '@mui/material';
import { blueGrey } from '@mui/material/colors';

//https://mui.com/x/react-data-grid/

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

const client = createDockerDesktopClient();

function useDockerDesktopClient() {
  return client;
}

export function Test() {
  const [response, setResponse] = React.useState<string>('dangling-images');
  const [containers, setContainers] = React.useState<any[]>([]);

  const ddClient = useDockerDesktopClient();

  useEffect(()=>{
     if (response === 'dangling-images'){
        //docker images --filter "dangling=true"
        ddClient.docker.cli.exec('images', ['--format', '"{{json .}}"', '--filter', "dangling=true"])
        .then((result) => {
          setContainers(result.parseJsonLines());
        });
    } else {
        ddClient.docker.cli.exec('ps', ['--all', '--format', '"{{json .}}"', '--filter', "status=exited"])
        .then((result) => {
          setContainers(result.parseJsonLines());
        });

    }

  },[response])

 
  return (
    <>
        <Container
            sx={{
                width: '95vw',
                height: '85vh',
                bgcolor: blueGrey[50],
                display: 'flex',
                alignItems:'center',
                justifyContent:'space-around',
                border:2,
                borderColor:'primary.main'

            }}
        >
            <Box 
            sx={{
                bgcolor: blueGrey[50],
                width:'30%', 
                height:'85%',
                borderRadius: 2,
                border:2,
                borderColor:'primary.main'
            }}
            >
            <Stack>
                
                <Button variant="contained" onClick={()=>{setResponse('dangling-images')}} sx={{
                    m:2,
                    p: 1,
                    borderRadius: 2
                    }}>
                    Dangling Images
                </Button>
                <Button variant="contained" onClick={()=>{setResponse('unused-containers')}} sx={{
                    m:2,
                    p: 1,
                    borderRadius: 2
                }}>
                    UnUsed Containers
                </Button>
            </Stack>
            </Box>
            <Box sx={{
                width:'65%', 
                height:'85%',
                bgcolor: blueGrey[50],
                borderRadius: 2,
                border:2,
                borderColor:'primary.main',
                overflow: 'auto'
                }}>
            <TableContainer sx={{mt:2}}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Size</TableCell>
              <TableCell>Created</TableCell>
              <TableCell>{response === 'unused-containers' ? 'Status' : 'Tag'}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {containers.map((container) => (
              <TableRow
                key={container.Id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell>{container.ID}</TableCell>
                <TableCell>{container.Size}</TableCell>
                <TableCell>{response === 'dangling-images' ? container.CreatedSince : container.RunningFor}</TableCell>
                <TableCell>{response === 'unused-containers' ? container.Status : container.Tag}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

      </TableContainer>
            </Box>
        </Container>
    </>
  );
}
