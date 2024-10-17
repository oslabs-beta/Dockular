import React from 'react';
import { Link } from "react-router-dom"
import { Route, Routes } from "react-router"
import Button from '@mui/material/Button';
import { Metrics } from "./metrics/components/cpu-ram"
import { Prune } from "./prune/prune"
import { Home } from './Home';
import myIcon from './img/icon.png'
import { Navigate } from "react-router-dom";
import { Stack } from '@mui/material';
import { BackendTest } from './backendTest/BackendTest';


//types
import { ImageType, StorageSizeType, SelectedRowSizeType, TotalStorageType, AllImageAndContainerStorageType, ContainerType, BuildCacheType } from './types';

//contextApi
import { CentralizedStateContext } from './prune/context/CentralizedStateContext';

// Note: This line relies on Docker Desktop's presence as a host application.
// If you're running this React app in a browser, it won't work properly.



const App = () => {



  const [dataGridBlueButtonType, setDataGridBlueButtonType] = React.useState<string>('dangling-images');

  type dataForGridRowType = ImageType[] | ContainerType[] | BuildCacheType[]
  const [dataForGridRows, setDataForGridRows] = React.useState<dataForGridRowType>([]);

  const [storageSizeById, setStorageSizeById] = React.useState<StorageSizeType>({
    'running-containers':{},
    'exited-containers':{},  
    'paused-containers':{},
    'dangling-images': {}, 
    'in-use-images': {},
    'unused-images':{},
    'built-casche': {},
  })

  const [selectedGridRowStorageSize, setSelectedGridRowStorageSize] =  React.useState<SelectedRowSizeType>({
    'running-containers': 0,
    'exited-containers': 0, 
    'paused-containers':0,
    'dangling-images': 0, 
    'in-use-images': 0,
    'unused-images':0,
    'built-casche': 0,
    'selectedTotal': 0, 
  })

  const [totalStorageTypes, setTotalStorageTypes] = React.useState<TotalStorageType>({
    'running-containers': 0,
    'exited-containers': 0,  
    'paused-containers':0,
    'dangling-images': 0,
    'in-use-images': 0,
    'unused-images':0,
    'built-casche': 0,
    'combinedTotal': 0
  });

  const [allImageAndContainerStorage, setAllImageAndContainerStorage] = React.useState<AllImageAndContainerStorageType>({
    'all-images': 0, 
    'all-containers': 0
  });

  const resetPruneSection = () => {

    setDataGridBlueButtonType('dangling-images');

    setDataForGridRows([]);

    setStorageSizeById({
      'running-containers':{},
      'exited-containers':{},  
      'paused-containers':{},
      'dangling-images': {}, 
      'in-use-images': {},
      'unused-images':{},
      'built-casche': {},
    });

    setSelectedGridRowStorageSize({
      'running-containers': 0,
      'exited-containers': 0, 
      'paused-containers':0,
      'dangling-images': 0, 
      'in-use-images': 0,
      'unused-images':0,
      'built-casche': 0,
      'selectedTotal': 0, 
    });

    setTotalStorageTypes({
      'running-containers': 0,
      'exited-containers': 0,  
      'paused-containers':0,
      'dangling-images': 0,
      'in-use-images': 0,
      'unused-images':0,
      'built-casche': 0,
      'combinedTotal': 0
    });

    setAllImageAndContainerStorage({
      'all-images': 0, 
      'all-containers': 0
    })
  }

  return (
    <>
      <Stack
        direction="row"
        justifyContent="center"
        alignItems="center"
        spacing={5}
        sx= {{ pt: 2, pb : 2}}
      >
       
        <Link to="/" style={{ width: '42px', height: 'auto', marginTop: '5px'}}>
          <img src={myIcon} style={{ width: '100%', height: '80%' }} />
        </Link>

        <Button variant="contained">
          <Link onClick={resetPruneSection} to = {'/metrics'} style={{color:'white', textDecoration:'none'}} > 
            {'Metrics'}
          </Link>
        </Button>

        <Button variant="contained">
          <Link to = {'/prune'} style={{color:'white', textDecoration:'none'}}> 
            {'Prune'}
          </Link>
        </Button>

        <Button variant="contained">
        <Link to = {'/backendTest'} style={{color:'white', textDecoration:'none'}}> 
            {'Backend Test'}
          </Link>
        </Button>
      </Stack>
      
      <Routes>
        <Route path="*" element={<Navigate to="/" />} />
        <Route path ="/" element = {<Home />}/>
        <Route path ="/metrics" element = {<Metrics />}/>
        <Route path ="/prune" element = {
          <CentralizedStateContext.Provider value = {{
            dataGridBlueButtonType, setDataGridBlueButtonType,
            dataForGridRows, setDataForGridRows,
            storageSizeById, setStorageSizeById,
            selectedGridRowStorageSize, setSelectedGridRowStorageSize,
            totalStorageTypes, setTotalStorageTypes,
            allImageAndContainerStorage, setAllImageAndContainerStorage,
           }}>
            <Prune />
          </CentralizedStateContext.Provider>
        }/>
        <Route path ="/backendTest" element = {<BackendTest />}/>

      </Routes>
    </>
  );
}

export {App}
