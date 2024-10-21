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


export function AdvancedFeatures() {

    const ddClient = useDockerDesktopClient();
    const navigate = useNavigate();


    const [username,setUsername] = useState<string>('');
    const [password,setPassword] = useState<string>('');

    // useEffect(()=>{
    //     console.log(username)
    //     console.log(password)
    // },[username, password])

    const SubmitTest = () => {
        console.log('submitTest in AdvancedFeatures')
    }
  
    const RegisterUserAndPass = async () => {

        console.log('RegisterUserAndPass in AdvancedFeatures',)

        const newUser = {
            user_name: username,
            password: password
        }

        console.log('newUser in AdvancedFeatures file', newUser)

        // await fetch('api/user/registerUser', {
        //     method: 'POST',
        //     headers: {
        //       "Content-Type": "application/json"
        //     },
        //     body: JSON.stringify(newUser)
        //   })
        //     .then(data => data.json())
        //     .then(jsonData => {
        //       // console.log('data within handleSubmit in react component -->', jsonData)
        //     })
        //     .catch(err => console.log(err)); 

            const signupResult:any = await ddClient.extension.vm?.service?.post(
                '/api/user/registerUser',
                newUser
            );

       
            //redirect to prune page
          navigate('/prune');
          // toast success message
      ddClient.desktopUI.toast.success('SUCCESS! Welcome to Dockular.');
    }


  return (
    <>
        <Container sx={{
            height: '85vh',
            bgcolor: blueGrey[50],
            display: 'flex',
            flexDirection: 'column',
            justifyContent:'space-around',
            alignItems:'center',
            border:2,
            // borderColor:'red'
            borderColor:'primary.main'
        }}>
            <Box sx={{
                border:2,
                borderColor:'red',
                height: '45vh',
                width: '45vw',
                display: 'flex',
                flexDirection: 'column',
                
             }}>
            <TextField
                id="outlined-password-input"
                label="Username"
                type="Username"
                autoComplete="current-Username"
                onChange={(event: React.ChangeEvent<HTMLInputElement>)=>{
                    setUsername(event.target.value)
                }}
            />
            <TextField
                 id="outlined-password-input"
                 label="Password"
                 type="password"
                autoComplete="current-password"
                onChange={(event: React.ChangeEvent<HTMLInputElement>)=>{
                    setPassword(event.target.value)
                }}
            />
             <Button variant="contained" onClick={()=>{RegisterUserAndPass()}}>
               Register
            </Button>

             <Button variant="contained" onClick={()=>{SubmitTest()}}>
               Submit
            </Button>
            </Box>
        </Container>
     
    </>
  );
} 


