import React, {useEffect} from 'react';
import Button from '@mui/material/Button';
import { createDockerDesktopClient } from '@docker/extension-api-client';
import { Box, Container } from '@mui/material';
import { blueGrey, red} from '@mui/material/colors';

import { DataGrid, GridRowsProp, GridColDef } from '@mui/x-data-grid';


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
  const [prune, setPrune] = React.useState<string>('');
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

  const rows: GridRowsProp = containers.map((image) => ({
    id:image.ID,
    col1:image.Size,
    col2:image.CreatedSince,
    col3:image.Tag
  }));

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 150 },
    { field: 'col1', headerName: 'Size', width: 150 },
    { field: 'col2', headerName: 'Created', width: 150 },
    { field: 'col3', headerName: 'Tag', width: 150 }
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
                <DataGrid rows={rows} columns={columns} checkboxSelection/>
            </Box>

          </Box>
          <Box sx={{
            width: '90vw',
            height: '40vh',
            bgcolor: blueGrey[50],
            display: 'flex',
            // alignItems:'center',
            justifyContent:'space-around',
            // border:2,
            // borderColor:'primary.main'
            // marginTop:2

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
                
                <Button variant="contained" color='error' onClick={()=>{setPrune('prune')}} sx={{
                    m:2,
                    p: 1,
                    borderRadius: 2
                    }}>
                    Prune
                </Button>
                <Button variant="contained" color='error' onClick={()=>{setPrune('scheduled')}} sx={{
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
            // width: '88vw',
            // height: '40vh',
            // bgcolor: blueGrey[50],
            // borderRadius: 2,
            // border:2,
            // borderColor:'primary.main',
            // marginLeft:2
          
            width:'70%', 
                height:'90%',
                bgcolor: blueGrey[50],
                borderRadius: 2,
                border:2,
                borderColor:'primary.main',
                
        }}> Chart 
          </Box>
          </Box>
        </Container>
    </>
  );
}



// import React, {useEffect} from 'react';
// import Button from '@mui/material/Button';
// import { createDockerDesktopClient } from '@docker/extension-api-client';
// import { Box, Container } from '@mui/material';
// import { blueGrey } from '@mui/material/colors';
// import { DataGrid, GridRowsProp, GridColDef } from '@mui/x-data-grid';


// //https://mui.com/x/react-data-grid/

// import {
//     Paper,
//     Stack,
//     Table,
//     TableBody,
//     TableCell,
//     TableContainer,
//     TableHead,
//     TableRow,
//     Typography,
//     TextField
//   } from "@mui/material";

// const client = createDockerDesktopClient();

// function useDockerDesktopClient() {
//   return client;
// }

// export function Test() {
//   const [response, setResponse] = React.useState<string>('dangling-images');
//   const [containers, setContainers] = React.useState<any[]>([]);

//   const ddClient = useDockerDesktopClient();

//   const columns: GridColDef[] = [
//     { field: 'col1', headerName: 'ID', width: 150 },
//     { field: 'col2', headerName: 'Size', width: 150 },
//     { field: 'col3', headerName: 'Created', width: 150 },
//     { field: 'col4', headerName: 'Tag', width: 150 }
//   ];

//   // const rows: GridRowsProp = [
//   //   { id: 1, col1: 'Hello', col2: 'World' },
//   //   { id: 2, col1: 'DataGridPro', col2: 'is Awesome' },
//   //   { id: 3, col1: 'MUI', col2: 'is Amazing' },
//   // ];
  
//   const rows: GridRowsProp = containers.map((image) => ({
//     id:image.ID,

    
//   }));



//   useEffect(()=>{
//      if (response === 'dangling-images'){
//         //docker images --filter "dangling=true"
//         ddClient.docker.cli.exec('images', ['--format', '"{{json .}}"', '--filter', "dangling=true"])
//         .then((result) => {
//           setContainers(result.parseJsonLines());
//         });
//     } else {
//         ddClient.docker.cli.exec('ps', ['--all', '--format', '"{{json .}}"', '--filter', "status=exited"])
//         .then((result) => {
//           setContainers(result.parseJsonLines());
//         });
//     }

//   },[response])

 
//   return (
//     <>
//         <Container
//             sx={{
//                 width: '95vw',
//                 height: '85vh',
//                 bgcolor: blueGrey[50],
//                 display: 'flex',
//                 flexDirection: 'column',
//                 border:2,
//                 borderColor:'primary.main'

//             }}
//         >
//           <Box 
//           sx={{
//             width: '90vw',
//             height: '43vh',
//             bgcolor: blueGrey[50],
//             display: 'flex',
//             // alignItems:'center',
//             justifyContent:'space-around',
//             // border:2,
//             // borderColor:'primary.main'
//             marginTop:2

//         }}>
//             <Box 
//             sx={{
//                 bgcolor: blueGrey[50],
//                 width:'25%', 
//                 height:'90%',
//                 borderRadius: 2,
//                 border:2,
//                 borderColor:'primary.main'
//             }}
//             >
//             <Stack>
                
//                 <Button variant="contained" onClick={()=>{setResponse('dangling-images')}} sx={{
//                     m:2,
//                     p: 1,
//                     borderRadius: 2
//                     }}>
//                     Dangling Images
//                 </Button>
//                 <Button variant="contained" onClick={()=>{setResponse('unused-containers')}} sx={{
//                     m:2,
//                     p: 1,
//                     borderRadius: 2
//                 }}>
//                     UnUsed Containers
//                 </Button>
//             </Stack>
//             </Box>
//             <Box sx={{
//                 width:'70%', 
//                 height:'90%',
//                 bgcolor: blueGrey[50],
//                 borderRadius: 2,
//                 border:2,
//                 borderColor:'primary.main',
//                 overflow: 'auto'
//                 }}>
//             <TableContainer sx={{mt:2}}>
//         <Table>
//           <TableHead>
//             <TableRow>
//               <TableCell>ID</TableCell>
//               <TableCell>Size</TableCell>
//               <TableCell>Created</TableCell>
//               <TableCell>{response === 'unused-containers' ? 'Status' : 'Tag'}</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {containers.map((container) => (
//               <TableRow
//                 key={container.Id}
//                 sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
//               >
//                 <TableCell>{container.ID}</TableCell>
//                 <TableCell>{container.Size}</TableCell>
//                 <TableCell>{response === 'dangling-images' ? container.CreatedSince : container.RunningFor}</TableCell>
//                 <TableCell>{response === 'unused-containers' ? container.Status : container.Tag}</TableCell>
//               </TableRow>
//             ))}
//               </TableBody>
//               </Table>
//             </TableContainer>
//             </Box>
//           </Box>


//           <Box
//           sx={{
//             width: '90vw',
//             height: '40vh',
//             bgcolor: blueGrey[50],
//             borderRadius: 2,
//                 border:2,
//                 borderColor:'primary.main',
          

//         }}> Chart & Pruning Button Container
            
//             {/* <Box sx={{
//                 width:'95%', 
//                 height:'90%',
//                 bgcolor: blueGrey[50],
//                 borderRadius: 2,
//                 border:2,
//                 borderColor:'primary.main',
//                 }}>
//                   Chart & Pruning Button Container
//                 </Box> */}
//           </Box>
//         </Container>
//     </>
//   );
// }
