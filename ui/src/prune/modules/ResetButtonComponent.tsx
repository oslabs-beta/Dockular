//MUI
import IconButton from '@mui/material/IconButton';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
//Docker
import { createDockerDesktopClient } from '@docker/extension-api-client';
//contextApi
import { CentralizedStateContext } from '../context/CentralizedStateContext';
import { useContext, useEffect } from 'react';
//types
import { TotalStorageType, AllImageAndContainerStorageType, StorageSizeType} from '../../types';
import { ImageType, SelectedRowSizeType, ContainerType, BuildCacheType } from '../../types';
//Modules
import GetAllStorage from '../utilities/GetAllStorage/GetAllStorage';
import GetRunningContainers from '../utilities/GetAllStorage/GetRunningContainers';
//utils
import { BuiltCascheRowDataParser } from '../utilities/Parsers/builtCascheRowDataParser';
import AllImageAndContainerStorage from '../utilities/AllImageAndContainerStorage';

//Docker Desktop Client
const client = createDockerDesktopClient();
function useDockerDesktopClient() {
  return client;
}

export function ResetButtonComponent(props:any) {

    const ddClient = useDockerDesktopClient();

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
  
  
  /////////////////////////////////////////////////////////////////////////////
  type dataForGridRowType = ImageType[] | ContainerType[] | BuildCacheType[]; 
  
  interface dataForGridRowsInterface {
    dataForGridRows: dataForGridRowType,
    setDataForGridRows: React.Dispatch<React.SetStateAction<dataForGridRowType>>
  }
  
  const {dataForGridRows, setDataForGridRows} = useContext<dataForGridRowsInterface>(CentralizedStateContext)
  
  /////////////////////////////////////////////////////////////////////////////
  
  interface storageSizeByIdInterface { 
    storageSizeById: StorageSizeType
    setStorageSizeById :  (value: React.SetStateAction<StorageSizeType>) => void
  };
  
  const { storageSizeById, setStorageSizeById} = useContext<storageSizeByIdInterface>(CentralizedStateContext); 
  
  /////////////////////////////////////////////////////////////////////////////
  
  interface selectedGridRowStorageSizeInterface {
    selectedGridRowStorageSize: SelectedRowSizeType,
    setSelectedGridRowStorageSize :React.Dispatch<React.SetStateAction<SelectedRowSizeType>>
  }
  const { selectedGridRowStorageSize, setSelectedGridRowStorageSize} = useContext<selectedGridRowStorageSizeInterface>(CentralizedStateContext); 
  
        interface allImageAndContainerStorageInterface {
          allImageAndContainerStorage: AllImageAndContainerStorageType,
          setAllImageAndContainerStorage: React.Dispatch<React.SetStateAction<AllImageAndContainerStorageType>>
        }
  
  /////////////////////////////////////////////////////////////////////////////
  
  const {allImageAndContainerStorage, setAllImageAndContainerStorage} = useContext<allImageAndContainerStorageInterface>(CentralizedStateContext); 
  
        interface totalStorageTypesInterface {
          totalStorageTypes :  TotalStorageType,
          setTotalStorageTypes: React.Dispatch<React.SetStateAction<TotalStorageType>>
        }
      
  const {totalStorageTypes, setTotalStorageTypes} = useContext<totalStorageTypesInterface>(CentralizedStateContext); 
  
  /////////////////////////////////////////////////////////////////////////////
  
  //keeps track of state change in dataGridBlueButtonType and changes state in dataForGridRows state depending on selection of dangling-images,unused-container, or built casche
   
  const fillDataGrid = () => {
    //make sure the data grid has no selected rows
    props.apiRef.current.setRowSelectionModel([]);
    
    //command populates all dangling images
     if (dataGridBlueButtonType === 'dangling-images'){

      GetAllStorage(ddClient, 'data').
      then(res => {    
      setDataForGridRows(res.data['dangling-images'])
      })
     
      //COMMAND POPULATES UNUSED IMAGES
     } else if(dataGridBlueButtonType === 'unused-images') {

      GetAllStorage(ddClient, 'data').
      then(res => {    
      setDataForGridRows(res.data['unused-images'])
      });




     //command populates all 'in-use-images'
     } else if(dataGridBlueButtonType === 'in-use-images'){
      GetAllStorage(ddClient, 'data').
      then(res => {    
      setDataForGridRows(res.data['in-use-images'])
      
      })

      //EXITED CONTAINERS 
    } else if(dataGridBlueButtonType === 'exited-containers'){
        ddClient.docker.cli.exec('ps', ['--all', '--format', '"{{json .}}"', '--filter', "status=exited"])
        .then((result) => {
          setDataForGridRows(result.parseJsonLines());
        })

          //Paused Containers
      } else if(dataGridBlueButtonType === 'paused-containers'){
        ddClient.docker.cli.exec('ps', ['--all', '--format', '"{{json .}}"', '--filter', "status=paused"])
        .then((result) => {
          const pausedContainers:ContainerType[] = result.parseJsonLines()
          setDataForGridRows(pausedContainers);
          
        })

        //RUNNING CONTAINERS
      }else if(dataGridBlueButtonType === 'running-containers'){
        GetRunningContainers(ddClient)
        .then(result => { 
        setDataForGridRows(result)
        })

        //command populates all built casche
      }else if(dataGridBlueButtonType === 'built-casche'){
        ddClient.docker.cli.exec('builder', ['du', '--verbose'])
        .then((result) => {
          setDataForGridRows(JSON.parse(BuiltCascheRowDataParser(result.stdout)));
        })
      } 

      AllImageAndContainerStorage(ddClient).
      then(res => {    
       // console.log('res in useEffect - GetAllStorage(ddClient).', res)
       setAllImageAndContainerStorage({
        'all-images': res['all-images'],
        'all-containers' : res['all-containers'],
      }) 
     })
  
      GetAllStorage(ddClient, 'storage').
         then(res => {
          setTotalStorageTypes({
            'running-containers': res.storage['running-containers'], 
            'exited-containers':  res.storage['exited-containers'],  
            'paused-containers': res.storage['paused-containers'], 
            'dangling-images':  res.storage['dangling-images'],
            'in-use-images': res.storage['in-use-images'],
            'unused-images': res.storage['unused-images'],
            'built-casche': res.storage['built-casche'],
            'combinedTotal':  res.storage['combinedTotal'], 
          })
         })
 
    }
  
  const resetPruneSection = () => {
    fillDataGrid()
    }

    return (
        <>
            <IconButton onClick={resetPruneSection}><RestartAltIcon color='error' fontSize={ props.matches === true ? "large" : 'inherit'} /></IconButton>  
        </>
    )
}