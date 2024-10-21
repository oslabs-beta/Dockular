import { useState, useEffect } from 'react';
import { Box } from '@mui/system';
import { Container } from '@mui/system';
import { blueGrey } from '@mui/material/colors';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { useNavigate } from 'react-router-dom';

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
    const navigate = useNavigate();

    interface SignedInInterface {
        signedIn: boolean,
        setSignedIn: React.Dispatch<React.SetStateAction<boolean>>
      }

    const {signedIn, setSignedIn} = useContext<SignedInInterface>(CentralizedStateContext)

    const signOut = () => {
        setSignedIn(false);
        navigate('/signInRegister')
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
            </Box>
            <Box sx={{
                border:2,
                borderColor:'blue',
                backgroundColor: 'blue',
                width: '33vw',
                display: 'flex',
                flexDirection: 'column',
                
             }}>
                <Button variant="contained"  onClick={()=>{signOut()}} sx={{m:2}}>
                 Sign Out 
                </Button>
            </Box>
            <Box sx={{
                border:2,
                borderColor:'orange',
                backgroundColor:'orange',
                width: '33vw',
                display: 'flex',
                flexDirection: 'column',
                
             }}>
            </Box>
        </Container>
     
    </>
  );
} 


