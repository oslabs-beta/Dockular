import React from 'react';
import { App } from './App';

//types
import { ImageType, StorageSizeType, SelectedRowSizeType, TotalStorageType, AllImageAndContainerStorageType, ContainerType, BuildCacheType } from './types';

//contextApi
import { CentralizedStateContext } from './prune/context/CentralizedStateContext';

// Note: This line relies on Docker Desktop's presence as a host application.
// If you're running this React app in a browser, it won't work properly.

const CentralizedState = () => {

  const [signedIn, setSignedIn] = React.useState<boolean>(false);

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

  return (
    <>
       <CentralizedStateContext.Provider value = {{
            dataGridBlueButtonType, setDataGridBlueButtonType,
            dataForGridRows, setDataForGridRows,
            storageSizeById, setStorageSizeById,
            selectedGridRowStorageSize, setSelectedGridRowStorageSize,
            totalStorageTypes, setTotalStorageTypes,
            allImageAndContainerStorage, setAllImageAndContainerStorage,
            signedIn, setSignedIn
           }}>
            <App/>
        </CentralizedStateContext.Provider>
    </>
  );
}

export {CentralizedState}
