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
import { SignInRegister } from './advancedFeatures/SignInRegister';
import { UserSignedIn } from './advancedFeatures/UserSignedIn';
import { useEffect } from 'react';
import { createDockerDesktopClient } from '@docker/extension-api-client';
import axios from 'axios';

//types
import { ImageType, StorageSizeType, SelectedRowSizeType, TotalStorageType, AllImageAndContainerStorageType, ContainerType, BuildCacheType } from './types';

//contextApi
import { CentralizedStateContext } from './prune/context/CentralizedStateContext';
import { useContext } from 'react';

//Docker Desktop Client
const client = createDockerDesktopClient();
function useDockerDesktopClient() {
  return client;
}


const App = () => {
  
  const ddClient = useDockerDesktopClient();

   //setup DB
//  useEffect(()=>{
//   const setupPostgresTable:any = async () => {
//     console.log('useEffect within App.tsx file ran within')
//     try {
//       await ddClient.extension.vm?.service?.get('/api/setupDB/tableSetup');
//     } catch (err) {
//       console.error('Error from within app.tsx useEffect. Get request attempting to setup DB:', err);
//     }
//   };
//   setupPostgresTable()
//  }, []);

 

  // const [signedIn, setSignedIn] = React.useState<boolean>(false); 

  interface SignedInInterface {
    signedIn: boolean,
    setSignedIn: React.Dispatch<React.SetStateAction<boolean>>
  };

  const {signedIn, setSignedIn} = useContext<SignedInInterface>(CentralizedStateContext);
  
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


  // const [dataGridBlueButtonType, setDataGridBlueButtonType] = React.useState<string>('dangling-images');

  type BlueButtonType = 
  'running-containers' |
  'exited-containers' |
  'paused-containers'| 
  'dangling-images'| 
  'in-use-images'|
  'unused-images' |
  'built-casche' ;

  interface dataGridBlueButtonTypeInterface {
    dataGridBlueButtonType: BlueButtonType,
    setDataGridBlueButtonType :React.Dispatch<React.SetStateAction<string>>
  }
  const {dataGridBlueButtonType, setDataGridBlueButtonType} = useContext<dataGridBlueButtonTypeInterface>(CentralizedStateContext)


  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


  // type dataForGridRowType = ImageType[] | ContainerType[] | BuildCacheType[]
  // const [dataForGridRows, setDataForGridRows] = React.useState<dataForGridRowType>([]);

  type dataForGridRowType = ImageType[] | ContainerType[] | BuildCacheType[]; 
    
  interface dataForGridRowsInterface {
    dataForGridRows: dataForGridRowType,
    setDataForGridRows: React.Dispatch<React.SetStateAction<dataForGridRowType>>
  }

  const {dataForGridRows, setDataForGridRows} = useContext<dataForGridRowsInterface>(CentralizedStateContext)


  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


  // const [storageSizeById, setStorageSizeById] = React.useState<StorageSizeType>({
  //   'running-containers':{},
  //   'exited-containers':{},  
  //   'paused-containers':{},
  //   'dangling-images': {}, 
  //   'in-use-images': {},
  //   'unused-images':{},
  //   'built-casche': {},
  // })

  interface storageSizeByIdInterface { 
    storageSizeById: StorageSizeType
    setStorageSizeById :  (value: React.SetStateAction<StorageSizeType>) => void
  };

  const { storageSizeById, setStorageSizeById} = useContext<storageSizeByIdInterface>(CentralizedStateContext); 


  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  // const [selectedGridRowStorageSize, setSelectedGridRowStorageSize] =  React.useState<SelectedRowSizeType>({
  //   'running-containers': 0,
  //   'exited-containers': 0, 
  //   'paused-containers':0,
  //   'dangling-images': 0, 
  //   'in-use-images': 0,
  //   'unused-images':0,
  //   'built-casche': 0,
  //   'selectedTotal': 0, 
  // })
  
  interface selectedGridRowStorageSizeInterface {
    selectedGridRowStorageSize: SelectedRowSizeType,
    setSelectedGridRowStorageSize :React.Dispatch<React.SetStateAction<SelectedRowSizeType>>
  }
  const { selectedGridRowStorageSize, setSelectedGridRowStorageSize} = useContext<selectedGridRowStorageSizeInterface>(CentralizedStateContext); 


  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


  // const [totalStorageTypes, setTotalStorageTypes] = React.useState<TotalStorageType>({
  //   'running-containers': 0,
  //   'exited-containers': 0,  
  //   'paused-containers':0,
  //   'dangling-images': 0,
  //   'in-use-images': 0,
  //   'unused-images':0,
  //   'built-casche': 0,
  //   'combinedTotal': 0
  // });
  
  interface totalStorageTypesInterface {
    totalStorageTypes :  TotalStorageType,
    setTotalStorageTypes: React.Dispatch<React.SetStateAction<TotalStorageType>>
  }

  const {totalStorageTypes, setTotalStorageTypes} = useContext<totalStorageTypesInterface>(CentralizedStateContext); 


  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


  // const [allImageAndContainerStorage, setAllImageAndContainerStorage] = React.useState<AllImageAndContainerStorageType>({
  //   'all-images': 0, 
  //   'all-containers': 0
  // });

  interface allImageAndContainerStorageInterface {
    allImageAndContainerStorage: AllImageAndContainerStorageType,
    setAllImageAndContainerStorage: React.Dispatch<React.SetStateAction<AllImageAndContainerStorageType>>
  }
  const {allImageAndContainerStorage, setAllImageAndContainerStorage} = useContext<allImageAndContainerStorageInterface>(CentralizedStateContext); 


  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


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
          
             { signedIn === false ? 
                <Link to = {'/signInRegister'} style={{color:'white', textDecoration:'none'}}> 
                 {'Advanced Features'}
                </Link>
               :
               <Link to = {'/userSignedIn'} style={{color:'white', textDecoration:'none'}}> 
                 {'Advanced Features'}
                </Link>
             }
           
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
            signedIn, setSignedIn
           }}>
            <Prune />
          </CentralizedStateContext.Provider>
        }/>
        <Route path ="/signInRegister" element = {<SignInRegister />}/>
        {/* <Route path ="/userSignedIn" element = {
          <CentralizedStateContext.Provider value = {{signedIn, setSignedIn}}>
            <UserSignedIn />
          </CentralizedStateContext.Provider>
        }/> */}
        <Route path ="/backendTest" element = {<BackendTest />}/>
      </Routes>
    </>
  );
}

export {App}
