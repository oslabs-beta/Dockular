import React from 'react';
import { Stack, Typography  } from '@mui/material';
import { createDockerDesktopClient } from '@docker/extension-api-client';
import Button from '@mui/material/Button';

// import { DataGrid } from '@mui/x-data-grid';

import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2

// const client = createDockerDesktopClient();

// function useDockerDesktopClient() {
//     return client;
//   }



export default function Test() {

        return (
            
          <div>
            <h1>Test</h1>
            <button>I'm a button</button>
          </div>
        )
    //     return (
//         <>
//         {/* <Typography variant="h3">Dockular test</Typography>
//         <h1>Testing</h1>
//          */}


//     <Grid  direction={"row"}>
//       <Stack
//           direction="row"
//           justifyContent="center"
//           alignItems="center"
//           spacing={8}
//           sx= {{ pt : 4, pb : 8}}
//         >
//           <Typography variant="h3">TEST TSX</Typography>
//           <Button  href="/">Resource Monitor</Button>
//           <Button href="/">Prune</Button>
      
//         </Stack>
//         <>
//         <Typography variant="h3">Content</Typography>
//         </>

//     </Grid>

//     <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
//         This is a basic page rendered with MUI, using Docker's theme. Read the
//         MUI documentation to learn more. Using MUI in a conventional way and
//         avoiding custom styling will help make sure your extension continues to
//         look great as Docker's theme evolves.
//       </Typography>



//         </>

 }