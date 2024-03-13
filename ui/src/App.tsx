import React, {useEffect} from 'react';
import Button from '@mui/material/Button';
import { createDockerDesktopClient } from '@docker/extension-api-client';

import { Divider, Stack, TextField, Typography } from '@mui/material';
import { Link } from "react-router-dom"
import { Route, Routes } from "react-router"
import { Home } from './home/components/Home';
import { Test } from './test/Test'
import { Prune } from './prune/Prune';


// Note: This line relies on Docker Desktop's presence as a host application.
// If you're running this React app in a browser, it won't work properly.
const client = createDockerDesktopClient();

function useDockerDesktopClient() {
  return client;
}

export function App() {

  const ddClient = useDockerDesktopClient();

  return (
    <>
      <Stack
        direction="row"
        justifyContent="center"
        alignItems="center"
        spacing={8}
        sx= {{ pt : 4, pb : 8}}
      >
        <Typography variant="h3">Dockular</Typography>
        <Button>
          <Link to = {'/home'}>
            {'Home'}
          </Link>
        </Button>

          <Button>
          <Link to = {'/test'}> 
            {'Test'}
          </Link>
          </Button>

        <Button>
          <Link to = {'/prune'}> 
            {'Prune'}
          </Link>
        </Button>

      </Stack>
      <Routes>
      <Route path ="/home" element = {<Home/>}/>
        <Route path ="/test" element = {<Test />}/>
        <Route path ="/prune" element = {<Prune/>}/>
      </Routes>
    </>
  );
}
