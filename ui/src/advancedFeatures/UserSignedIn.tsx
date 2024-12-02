import React from "react";
import { Box } from "@mui/system";
import { Authenticator } from "@aws-amplify/ui-react";
import { Amplify } from "aws-amplify";
import "@aws-amplify/ui-react/styles.css";
import { Typography } from "@mui/material";
import { Button } from "@mui/material";
import { useState, useEffect } from 'react';
import { Stack, TextField } from '@mui/material';
import { Container } from '@mui/system';
import { blueGrey } from '@mui/material/colors';
import { signOut } from 'aws-amplify/auth';
import { cognitoUserSessionInfo } from './utilities/api'

//Docker Desktop Client
import { createDockerDesktopClient } from '@docker/extension-api-client';

const client = createDockerDesktopClient();
function useDockerDesktopClient() {
  return client;
}

//contextApi
import { CentralizedStateContext } from '../prune/context/CentralizedStateContext';
import { useContext } from 'react';

export function UserSignedIn() {

    const ddClient = useDockerDesktopClient();
    const [response, setResponse] = useState<string>();
    const [userData, setUserData] = useState<any>()

    useEffect(()=>{
      async function fetchCognitoData(){
        const data = await cognitoUserSessionInfo();
        setUserData(data)
      }
      fetchCognitoData();
    }, [])

    const fetchAndDisplayResponse = async () => {
      console.log('get request for the api gateway');
      console.log('cognitoId', userData.data.userSub)
      const cognitoId = {cognito_id : userData.data.userSub}
      try{
        // const results:any = await ddClient.extension.vm?.service?.get(`/get-user/:${userData.data.userSub}`)
        const results:any = await ddClient.extension.vm?.service?.post(`/api/user/get-user`, cognitoId)
        // const results:any = await ddClient.extension.vm?.service?.post(`/get-user`, cognitoId)

        console.log('results in userSignedIn.tsx', results)
        setResponse(JSON.stringify(results));
      } catch(error){
        setResponse(`Error in get request in UserSignedIn.tsx: ${JSON.stringify(error)}`);  
      }
    }

    const signOutHelper = async () => {
      try{
        await signOut()
      } catch (error) {
        console.error('Error signing out: ', error)
      }
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

           
        </Container>
     
    </>

  );
} 


