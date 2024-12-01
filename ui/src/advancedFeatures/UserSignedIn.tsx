import React from "react";
import { Box } from "@mui/system";
import { Authenticator } from "@aws-amplify/ui-react";
import { Amplify } from "aws-amplify";
import "@aws-amplify/ui-react/styles.css";
import { Typography } from "@mui/material";
import { Button } from "@mui/material";
import { useState } from 'react';
import { Stack, TextField } from '@mui/material';
import { signOut } from 'aws-amplify/auth';
import { getCurrentUser } from 'aws-amplify/auth';
import { Container } from '@mui/system';
import { blueGrey } from '@mui/material/colors';

//Docker Desktop Client
import { createDockerDesktopClient } from '@docker/extension-api-client';

const client = createDockerDesktopClient();
function useDockerDesktopClient() {
  return client;
}

//contextApi
import { CentralizedStateContext } from '../prune/context/CentralizedStateContext';
import { useContext } from 'react';


export  function UserSignedIn() {

    const ddClient = useDockerDesktopClient();
    const [response,setResponse] = useState<string>();

   getCurrentUser()
   .then(res => console.log('res', res))

    

    const fetchAndDisplayResponse = async () => {
      console.log('get request for the api gateway');
      // await ddClient.extension.vm?.service?.get('/api/setupDB/tableSetup');
        const results:any = await ddClient.extension.vm?.service?.get('/api/user/get-user')
        setResponse(JSON.stringify(results));
  }

  const signOutHelper = async () => {
      await signOut()
  }
   

  return (
    <>
        <Container sx={{
            height: '85vh',
            bgcolor: blueGrey[50],
            display: 'flex',
            flexDirection: 'row',
            border:2,
            // borderColor:'red'
            borderColor:'primary.main'
        }}>
            <Box sx={{
                border:2,
                borderColor:'red',
                backgroundColor:'red',
                width: '33vw',
                display: 'flex',
                flexDirection: 'column',
                
             }}>

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

                    <Button onClick={signOutHelper}>Sign out</Button>
                </Stack>


            </Box>

        </Container>
     
    </>
  );
} 


