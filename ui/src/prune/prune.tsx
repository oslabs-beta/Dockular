import React, {useEffect} from 'react';
import Button from '@mui/material/Button';
import { createDockerDesktopClient } from '@docker/extension-api-client';
import { Box, Container } from '@mui/material';
import { blueGrey, red} from '@mui/material/colors';
import {  Stack } from "@mui/material";
import { DataGrid, GridRowsProp, GridColDef, GridEventListener} from '@mui/x-data-grid';
import { useGridApiRef } from '@mui/x-data-grid';

const client = createDockerDesktopClient();

function useDockerDesktopClient() {
  return client;
}

export function Prune() {

  const [response, setResponse] = React.useState<string>('dangling-images');
  const [containers, setContainers] = React.useState<any[]>([]);
  // const [images, setImages] =  React.useState<any[]>([]);
  const [images, setImages] =  React.useState<string>('');
  
  //state for dataGrid
  const apiRef = useGridApiRef();
 

  const ddClient = useDockerDesktopClient();

  //keeps track of state change in response and changes state in containers depending on selection dangling-images of exited-containers
  useEffect(()=>{
     if (response === 'dangling-images'){
        ddClient.docker.cli.exec('images', ['--format', '"{{json .}}"', '--filter', "dangling=true"])
        .then((result) => {
          setContainers(result.parseJsonLines());
        });
        
    } else if(response === 'unused-containers'){
        ddClient.docker.cli.exec('ps', ['--all', '--format', '"{{json .}}"', '--filter', "status=exited"])
        .then((result) => {
          setContainers(result.parseJsonLines());
        })
      }
  },[response])

  // const pruningFunc = ( arg:String) => {
  //   console.log(`Button Clicked : ${arg}`);
  // }

  // useEffect(()=>{
  //   const handleRowClick: GridEventListener<'rowClick'> = (params) => {
  //     console.log(params)
  //   };
  //   return apiRef.current.subscribeEvent('rowClick', handleRowClick);
  // },[apiRef])

  const handleRowClick: GridEventListener<'rowClick'> = (params) => {
      // setImages([...images, {id:params.row.id}]);
      setImages(params.row.id);
  };

  // const graphFunc = (images:any) => {
  //   console.log(images)
  // }

  useEffect(()=>{
    console.log(images)
  }, [images]);

  
  //function does pruning commands depending on prune state
  const pruningFunc = async (prune:String, selectedImageArray = apiRef.current.getSelectedRows()) => {

    if(prune === 'prune-all') {

    } else if(prune === 'prune-selected') {
    
     const imageIdsToSpread = [];
      for(let el of selectedImageArray){
        imageIdsToSpread.push(el[1].id);
      }
      console.log(imageIdsToSpread)
      // docker image prune -a --filter
       await  ddClient.docker.cli.exec('rmi', [...imageIdsToSpread])
   
       setContainers([]);

       await ddClient.docker.cli.exec('images', ['--format', '"{{json .}}"', '--filter', "dangling=true"])
        .then((result) => {
          setContainers(result.parseJsonLines());
        });
   } else {
   }
  }
 
  const rows: GridRowsProp = containers.map((image) => ({
    id:image.ID,
    col1:image.Size,
    col2: response === 'dangling-images' ? image.CreatedSince : image.RunningFor,
    col3: response === 'dangling-images' ? image.Tag : image.Status
  }));

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 150 },
    { field: 'col1', headerName: 'Size', width: 150 },
    { field: 'col2', headerName: 'Created', width: 150 },
    { field: 'col3', headerName: response === 'dangling-images'? 'Tag' : 'Status' , width: 150 }
  ];
  
  return (
    <>
        <Container
            sx={{
                width: '95vw',
                height: '85vh',
                bgcolor: blueGrey[50],
                display: 'flex',
                flexDirection: 'column',
                border:2,
                borderColor:'primary.main'

            }}
        >
          <Box 
          sx={{
            width: '90vw',
            height: '40vh',
            bgcolor: blueGrey[50],
            display: 'flex',
            justifyContent:'space-around',
            marginTop:4

        }}>
            <Box 
            sx={{
                bgcolor: blueGrey[50],
                width:'25%', 
                height:'90%',
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
                width:'70%', 
                height:'90%',
                bgcolor: blueGrey[50],
                borderRadius: 2,
                border:2,
                borderColor:'primary.main',
                overflow: 'auto'
                }}>
                <DataGrid rows={rows} columns={columns} checkboxSelection apiRef={apiRef} onRowClick={handleRowClick}/>
            </Box>

          </Box>
          <Box sx={{
            width: '90vw',
            height: '40vh',
            bgcolor: blueGrey[50],
            display: 'flex',
            justifyContent:'space-around',

        }}>
          <Box
          sx={{
            bgcolor: blueGrey[50],
            width:'25%', 
            height:'90%',
            borderRadius: 2,
            border:2,
            borderColor:'primary.main'
        }}> 
          <Stack>
            {/* , graphFunc(images) */}
                <Button variant="contained" color='error' onClick={()=>{pruningFunc('prune-all')}} sx={{
                    m:2,
                    p: 1,
                    borderRadius: 2
                    }}>
                    Prune All
                </Button>
                
                <Button variant="contained" color='error' onClick={()=>{pruningFunc('prune-selected')}} sx={{
                    m:2,
                    p: 1,
                    borderRadius: 2
                    }}>
                    Prune Selected
                </Button>
                {/* <Button variant="contained" color='error' onClick={()=>{console.log('Scheduled Prune Pressed'); testApi();}} sx={{ */}
                <Button variant="contained" color='error' onClick={()=>{pruningFunc("scheduled-prune")}} sx={{
                    m:2,
                    p: 1,
                    borderRadius: 2
                }}>
                    Scheduled Prune
                </Button>
            </Stack>
          </Box>
          

          <Box
          sx={{
            width:'70%', 
            height:'90%',
            bgcolor: blueGrey[50],
            borderRadius: 2,
            border:2,
            borderColor:'primary.main',
            display: 'flex',
            alignItems: 'end',
            justifyContent: 'center'
        }}> 
           {/* <Button variant="contained" color='error' onClick={()=>{graphFunc(images)}} sx={{
                    m:2,
                    p: 1,
                    width:'95%',
                    height: '10%',
                    borderRadius: 2
                }}>
                    Run Chart
                </Button> */}

          </Box>
          </Box>
        </Container>
    </>
  );
}