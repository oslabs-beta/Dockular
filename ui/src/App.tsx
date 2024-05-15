import React from 'react';
import { Link } from "react-router-dom"
import { Route, Routes } from "react-router"
import Button from '@mui/material/Button';
import { createDockerDesktopClient } from '@docker/extension-api-client';
import { Divider, Stack, TextField, Typography } from '@mui/material';
import { Metrics } from "./metrics/components/cpu-ram"
import { Prune } from "./prune/prune"
import { Home } from './Home';
import myIcon from './img/icon.png'
import { Container, Box} from '@mui/material';
import myImage from './img/logo.png';
import { RouteProps } from 'react-router-dom'
import { Navigate } from "react-router-dom";



// Note: This line relies on Docker Desktop's presence as a host application.
// If you're running this React app in a browser, it won't work properly.



const App = () => {

  return (
    <>
      <Stack
        direction="row"
        justifyContent="center"
        alignItems="center"
        spacing={5}
        sx= {{ pt : 2, pb : 2}}
      >
       

        <Link to="/" style={{ width: '4%', height: 'auto', marginTop: '5px' }}>
          <img src={myIcon} style={{ width: '100%', height: 'auto' }} />
        </Link>

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
        <Route path="*" element={<Navigate to="/" />} />
        <Route path ="/" element = {<Home />}/>
        <Route path ="/metrics" element = {<Metrics />}/>
        <Route path ="/prune" element = {<Prune />}/>
      </Routes>

    </>
    
  );
}

export {App}
