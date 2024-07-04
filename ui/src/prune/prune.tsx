import React, { useEffect } from 'react';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import { createDockerDesktopClient } from '@docker/extension-api-client';
import { Box, Container } from '@mui/material';
import { blueGrey } from '@mui/material/colors';
import { Stack } from "@mui/material";

import useMediaQuery from '@mui/material/useMediaQuery';
import { createTheme } from '@mui/material';


//mui grid
import { DataGrid, GridRowsProp, GridColDef, GridEventListener} from '@mui/x-data-grid';
import { useGridApiRef } from '@mui/x-data-grid';

//components
import { ProgressbarChartComponent } from './components/ProgressbarChartComponent';
import { PruneAllButtonComponent } from './components/PruneAllButtonComponent';
import { ImageButtonComponent } from './components/ImageButtonComponent';
import { ContainerButtonComponent } from './components/ContainerButtonComponent';
 

//modules
import GetAllStorage from './modules/GetAllStorage/GetAllStorage';
import GetRunningContainers from './modules/GetAllStorage/GetRunningContainers';
import { BuiltCascheRowDataParser } from './modules/builtCascheRowDataParser';
import { containerVirtualSizeConverterToString } from './modules/ContainerVirtualSizeConverterToString';
import { dataGridTypeHeaderHelper } from './modules/dataGridTypeHeaderHelper';
import AllImageAndContainerStorage from './modules/AllImageAndContainerStorage';
import { rowColumnTypeHelper } from './modules/GetAllStorage/rowColumnTypeHelper';

//utilities
import { storageNumToStr } from './utilities/StorageNumtoStr';
import { checkBytesAndConvertToNumber } from './utilities/ CheckBytesAndConvertToNumber';

//TYPES
import { ImageType, StorageSizeType, SelectedRowSizeType, TotalStorageType, AllImageAndContainerStorageType } from '../types'

//Docker Desktop Client
const client = createDockerDesktopClient();
function useDockerDesktopClient() {
  return client;
}


export function Prune() {

  const ddClient = useDockerDesktopClient();
  
  // console.log(ddClient)
  
  //state for dataGrid
  const apiRef = useGridApiRef();
 
  //state trackings whether we have clicked dangling-images, unsused containers or built-casche
  const [dataGridBlueButtonType, setDataGridBlueButtonType] = React.useState<string>('dangling-images');

  //state that manages a list of all the dangling images, unused containers, and builtCasche
  const [dataForGridRows, setDataForGridRows] = React.useState<ImageType>([]);

  //state that handles the size of each image and container. Data is utilized to calculate size...which affects datagrid etc. 
  //This state seems to only be utilized for tracking the value of the id selected for the given container/image. See if you can combine with other state? 
  //helps us keep track of the ids of selected images/containers so we know what to prune. 
  //{ [key: string] : { [key: string]: string }
  const [storageSizeById, setStorageSizeById] = React.useState<StorageSizeType>({
    'running-containers':{},
    'exited-containers':{},  
    'paused-containers':{},
    'dangling-images': {}, 
    'in-use-images': {},
    'unused-images':{},
    'built-casche': {},
  })

  //state that manages the current amount of storage size used from each selected image/container/builtCasche from the Data Grid component
  //The storage you've selected within each category. Helps us calcualte the total selected within each category. 
  //{ [key: string]: number }
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

  //state that manages the total amount of storage being used by unused-containers, dangling-images, built-casche and the combined-total
  //{ [key: string]: number }
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

  //{ [key: string]: number }
  const [allImageAndContainerStorage, setAllImageAndContainerStorage] = React.useState<AllImageAndContainerStorageType>({
    'all-images': 0, 
    'all-containers': 0
  });

  // useEffect(()=>{
  //   console.log('selectedGridRowStorageSize', selectedGridRowStorageSize, 'storageSizeById', storageSizeById)
  // },[selectedGridRowStorageSize, ])


  useEffect(()=>{
    AllImageAndContainerStorage(ddClient).
    then(res => {    
     // console.log('res in useEffect - GetAllStorage(ddClient).', res)
     
     setAllImageAndContainerStorage({
       'all-images': res['all-images'],
       'all-containers' : res['all-containers'],
     }) 
    })

    //gets the total amount of storage being used by each category and the combined total
       GetAllStorage(ddClient, 'storage').
       then(res => {    
        // console.log('res in useEffect - GetAllStorage(ddClient).', res)
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
       
  }, [])

 
   
  
  //keeps track of state change in dataGridBlueButtonType and changes state in dataForGridRows state depending on selection of dangling-images,unused-container, or built casche
  useEffect(()=>{
    
    //command populates all dangling images
     if (dataGridBlueButtonType === 'dangling-images'){
       
      GetAllStorage(ddClient, 'data').
      then(res => {    
      setDataForGridRows(res.data['dangling-images'])
      
      }).catch((err)=>{`Error in second use Effect tracking dataGridBlueButtonType within prune.tsx (DANGLING IMAGES) - Docker command in: GetAllStorage module ${err}`}) 

      //COMMAND POPULATES UNUSED IMAGES
     } else if(dataGridBlueButtonType === 'unused-images') {
      GetAllStorage(ddClient, 'data').
      then(res => {    

        console.log("res.data['unused-images']", res.data['unused-images']); 

      setDataForGridRows(res.data['unused-images'])
      }).catch((err)=>{`Error in second use Effect tracking dataGridBlueButtonType within prune.tsx (UNUSED IMAGES) - Docker command in: GetAllStorage module ${err}`})  

    //command populates all 'in-use-images'
    } else if(dataGridBlueButtonType === 'in-use-images'){

      GetAllStorage(ddClient, 'data').
      then(res => {    
        // console.log(res)
      setDataForGridRows(res.data['in-use-images'])
      
      }).catch((err)=>{`Error in second use Effect tracking dataGridBlueButtonType within prune.tsx (IN USE IMAGES) - Docker command in: GetAllStorage module${err}`})  

      //EXITED CONTAINERS 
    } else if(dataGridBlueButtonType === 'exited-containers'){
        ddClient.docker.cli.exec('ps', ['--all', '--format', '"{{json .}}"', '--filter', "status=exited"])
        .then((result) => {
          // console.log('psAll',result.parseJsonLines())
          setDataForGridRows(result.parseJsonLines());
          
        }).catch((err)=>{`Error in second use Effect tracking dataGridBlueButtonType within prune.tsx (EXITED CONTAINERS) - command: ddClient.docker.cli.exec('ps', ['--all', '--format', '"{{json .}}"', '--filter', "status=exited"]) ${err}`})

          //Paused Containers
      } else if(dataGridBlueButtonType === 'paused-containers'){
        ddClient.docker.cli.exec('ps', ['--all', '--format', '"{{json .}}"', '--filter', "status=paused"])
        .then((result) => {
          // console.log('psAll',result.parseJsonLines())
          setDataForGridRows(result.parseJsonLines());
          
        }).catch((err)=>{`Error in second use Effect tracking dataGridBlueButtonType within prune.tsx (PAUSED CONTAINERS) - command: ddClient.docker.cli.exec('ps', ['--all', '--format', '"{{json .}}"', '--filter', "status=exited"]) ${err}`})

        //RUNNING CONTAINERS
      }else if(dataGridBlueButtonType === 'running-containers'){
        GetRunningContainers(ddClient).
        then(res => { 
          // console.log('running containers', res)   
        setDataForGridRows(res)
        }).catch((err)=>{`Error in second use Effect tracking dataGridBlueButtonType within prune.tsx (RUNNING CONTAINERS) Docker command in: GetRunningContainers module ${err}`})  
       
        //command populates all built casche
      }else if(dataGridBlueButtonType === 'built-casche'){
        ddClient.docker.cli.exec('builder', ['du', '--verbose'])
        .then((result) => {
          // console.log('result.stdout within useEffect in prune file -->', result.stdout)
          // console.log('Parsed BuiltCascheRowDataParser(result) in prune useEffect', JSON.parse(BuiltCascheRowDataParser(result.stdout)))
          setDataForGridRows(JSON.parse(BuiltCascheRowDataParser(result.stdout)));
        }).catch((err)=>{`Error in use Effect within prune.tsx for BUILD CACHE - command: ddClient.docker.cli.exec('builder', ['du', '--verbose']) ${err}`})

      }  
      
  },[dataGridBlueButtonType])


  //This eventListener helps us keep track of the boxes selected/unselected in the grid by id and the size of each image based off id
  const handleCellClick: GridEventListener<'cellClick'> = (params) => {
    // const handleRowClick: GridEventListener<'rowClick'> = (params) => {

    
    if(dataGridBlueButtonType === 'dangling-images'){

      //user has selected row in dangling-images
      const imageStorageSize = params.row.size; //storage size
      
      
      //assumes images are only in megabytes, may have to consider kb, b or gb? Built casche has these values(mb,kb,b)
      const currImageSize = Math.trunc(Number(imageStorageSize.slice(0, length-2))); 

      //if image id is NOT in the object
      if(!storageSizeById['dangling-images'].hasOwnProperty(params.row.id)){
        //key is id and the value is the storage size 
        setStorageSizeById(storageSize => ({
          'running-containers': {...storageSize['running-containers']},
          'exited-containers': {...storageSize['exited-containers']},
          'paused-containers' : {...storageSize['paused-containers']},
          'dangling-images': {...storageSize['dangling-images'], [params.row.id] : currImageSize},
          'in-use-images' : {...storageSize['in-use-images']},
          'unused-images' : {...storageSize['unused-images']},
          'built-casche' : {...storageSize['built-casche']},
        }))
        
        

        /*we want to add to the selectedTotal - selectedGridRowStorageSize - within here because this is the logic
         that controls whether we SELECT the row. */
         setSelectedGridRowStorageSize(currSelectedStorage => ({
          'running-containers': currSelectedStorage['running-containers'],
          'exited-containers': currSelectedStorage['exited-containers'],
          'paused-containers': currSelectedStorage['paused-containers'],
          'dangling-images': currSelectedStorage['dangling-images'],
          'in-use-images': currSelectedStorage['in-use-images'],
          'unused-images': currSelectedStorage['unused-images'],
          'built-casche': currSelectedStorage['built-casche'],
          'selectedTotal': currSelectedStorage['selectedTotal'] + currImageSize, 
        }))
       
        
       
       
      } else {
        //else user has unselected row. Remove the key/value pair from storageSizeById.
        const copyOfImgCpuObj = {
        'running-containers': {...storageSizeById['running-containers']}, 
        'exited-containers': {...storageSizeById['exited-containers']}, 
        'paused-containers': {...storageSizeById['paused-containers']}, 
        'dangling-images': {...storageSizeById['dangling-images']}, 
        'in-use-images': {...storageSizeById['in-use-images']}, 
        'unused-images': {...storageSizeById['unused-images']}, 
        'built-casche': {...storageSizeById['built-casche']}
        };
        
        
       
        delete copyOfImgCpuObj['dangling-images'][params.row.id]; 

        setStorageSizeById(imgStorageSize=>({
          ...copyOfImgCpuObj
        }))

        /*we want to add to the selectedTotal - selectedGridRowStorageSize - within here because this is the logic
         that controls whether we UNSELECT the row. */
         setSelectedGridRowStorageSize(currSelectedStorage => ({
          'running-containers': currSelectedStorage['running-containers'],
          'exited-containers': currSelectedStorage['exited-containers'],
          'paused-containers': currSelectedStorage['paused-containers'],
          'dangling-images': currSelectedStorage['dangling-images'],
          'in-use-images': currSelectedStorage['in-use-images'],
          'unused-images': currSelectedStorage['unused-images'],
          'built-casche': currSelectedStorage['built-casche'],
          'selectedTotal': currSelectedStorage['selectedTotal'] - currImageSize, 
        }))
        
       
      }
      
 
    } else if(dataGridBlueButtonType === 'unused-images'){

      //user has selected row in dangling-images
      const imageStorageSize = params.row.size; //storage size
      //assumes images are only in megabytes, may have to consider kb, b or gb? Built casche has these values(mb,kb,b)
      const currImageSize = Math.trunc(Number(imageStorageSize.slice(0, length-2))); 

      //if image id is NOT in the object
      if(!storageSizeById['unused-images'].hasOwnProperty(params.row.id)){
        //key is id and the value is the storage size 
        setStorageSizeById(storageSize => ({
          'running-containers': {...storageSize['running-containers']},
          'exited-containers': {...storageSize['exited-containers']},
          'paused-containers': {...storageSize['paused-containers']},
          'dangling-images' : {...storageSize['dangling-images']},
          'in-use-images' : {...storageSize['in-use-images']},
          'unused-images': {...storageSize['unused-images'], [params.row.id] : currImageSize},
          'built-casche' : {...storageSize['built-casche']},
        }))

        

        /*we want to add to the selectedTotal - selectedGridRowStorageSize - within here because this is the logic
         that controls whether we SELECT the row. */
         setSelectedGridRowStorageSize(currSelectedStorage => ({
          'running-containers': currSelectedStorage['running-containers'],
          'exited-containers': currSelectedStorage['exited-containers'],
          'paused-containers': currSelectedStorage['paused-containers'],
          'dangling-images': currSelectedStorage['dangling-images'],
          'in-use-images': currSelectedStorage['in-use-images'],
          'unused-images': currSelectedStorage['unused-images'],
          'built-casche': currSelectedStorage['built-casche'],
          'selectedTotal': currSelectedStorage['selectedTotal'] + currImageSize, 
        }))

        
        
       
       
      } else {
        //else user has unselected row. Remove the key/value pair from storageSizeById.
        const copyOfImgCpuObj = {
        'running-containers': {...storageSizeById['running-containers']}, 
        'exited-containers': {...storageSizeById['exited-containers']}, 
        'paused-containers': {...storageSizeById['paused-containers']}, 
        'dangling-images': {...storageSizeById['dangling-images']}, 
        'in-use-images': {...storageSizeById['in-use-images']}, 
        'unused-images': {...storageSizeById['unused-images']}, 
        'built-casche': {...storageSizeById['built-casche']}
        };
        

        delete copyOfImgCpuObj['unused-images'][params.row.id]; 

        setStorageSizeById(imgStorageSize=>({
          ...copyOfImgCpuObj
        }))

        /*we want to add to the selectedTotal - selectedGridRowStorageSize - within here because this is the logic
         that controls whether we UNSELECT the row. */
         setSelectedGridRowStorageSize(currSelectedStorage => ({
          'running-containers': currSelectedStorage['running-containers'],
          'exited-containers': currSelectedStorage['exited-containers'],
          'paused-containers': currSelectedStorage['paused-containers'],
          'dangling-images': currSelectedStorage['dangling-images'],
          'in-use-images': currSelectedStorage['in-use-images'],
          'unused-images': currSelectedStorage['unused-images'],
          'built-casche': currSelectedStorage['built-casche'],
          'selectedTotal': currSelectedStorage['selectedTotal'] - currImageSize, 
        }))
      }
     

    }
    
    else if(dataGridBlueButtonType === 'in-use-images'){

      //user has selected row in dangling-images
      const imageStorageSize = params.row.size; //storage size
      //assumes images are only in megabytes, may have to consider kb, b or gb? Built casche has these values(mb,kb,b)
      const currImageSize = Math.trunc(Number(imageStorageSize.slice(0, length-2))); 

      //if image id is NOT in the object
      if(!storageSizeById['in-use-images'].hasOwnProperty(params.row.id)){
        //key is id and the value is the storage size 
        setStorageSizeById(storageSize => ({
          'running-containers': {...storageSize['running-containers']},
          'exited-containers': {...storageSize['exited-containers']},
          'paused-containers': {...storageSize['paused-containers']},
          'dangling-images': {...storageSize['dangling-images']},
          'in-use-images': {...storageSize['in-use-images'], [params.row.id] : currImageSize},
          'unused-images': {...storageSize['unused-images']},
          'built-casche' : {...storageSize['built-casche']},
        }))
       
        
        
        /*we want to add to the selectedTotal - selectedGridRowStorageSize - within here because this is the logic
         that controls whether we SELECT the row. */
         setSelectedGridRowStorageSize(currSelectedStorage => ({
          'running-containers': currSelectedStorage['running-containers'],
          'exited-containers': currSelectedStorage['exited-containers'],
          'paused-containers': currSelectedStorage['paused-containers'],
          'dangling-images': currSelectedStorage['dangling-images'],
          'in-use-images': currSelectedStorage['in-use-images'],
          'unused-images': currSelectedStorage['unused-images'],
          'built-casche': currSelectedStorage['built-casche'],
          'selectedTotal': currSelectedStorage['selectedTotal'] + currImageSize, 
        }))
        
       
      } else {
        //else user has unselected row. Remove the key/value pair from storageSizeById.
        const copyOfImgCpuObj = {
        'running-containers': {...storageSizeById['running-containers']}, 
        'exited-containers': {...storageSizeById['exited-containers']}, 
        'paused-containers': {...storageSizeById['paused-containers']}, 
        'dangling-images': {...storageSizeById['dangling-images']}, 
        'in-use-images': {...storageSizeById['in-use-images']}, 
        'unused-images': {...storageSizeById['unused-images']}, 
        'built-casche': {...storageSizeById['built-casche']}
      
      };
      
      
        delete copyOfImgCpuObj[ 'in-use-images'][params.row.id]; 

        setStorageSizeById(imgStorageSize=>({
          ...copyOfImgCpuObj
        }))

        /*we want to add to the selectedTotal - selectedGridRowStorageSize - within here because this is the logic
         that controls whether we UNSELECT the row. */
         setSelectedGridRowStorageSize(currSelectedStorage => ({
          'running-containers': currSelectedStorage['running-containers'],
          'exited-containers': currSelectedStorage['exited-containers'],
          'paused-containers': currSelectedStorage['paused-containers'],
          'dangling-images': currSelectedStorage['dangling-images'],
          'in-use-images': currSelectedStorage['in-use-images'],
          'unused-images': currSelectedStorage['unused-images'],
          'built-casche': currSelectedStorage['built-casche'],
          'selectedTotal': currSelectedStorage['selectedTotal'] - currImageSize, 
        }))
      } 
      
       
    }  else if (dataGridBlueButtonType === 'exited-containers'){ //EXITED
      //user has selected row in unused-containers
      
      const unusedContainerSizeStr = params.row.size; //storage size
      // console.log('unusedContainerSizeStr', checkBytesAndConvertToNumber(unusedContainerSizeStr))
      // const currbuiltCascheStorage = Math.trunc(Number(unusedContainerSizeStr.slice(0, length-2))); // storageSize converted to #
      const currContainerStorage = checkBytesAndConvertToNumber(unusedContainerSizeStr)

      //if image id is NOT in the object
      if(!storageSizeById['exited-containers'].hasOwnProperty(params.row.id)){
        //key is id and the value is the storage size 
        setStorageSizeById(storageSize => ({
          'running-containers': {...storageSize['running-containers']},
          'exited-containers': {...storageSize['exited-containers'],[params.row.id] : currContainerStorage},
          'paused-containers': {...storageSize['paused-containers']},
          'dangling-images': {...storageSize['dangling-images']},
          'in-use-images': {...storageSize['in-use-images']},
          'unused-images': {...storageSize['unused-images']},
          'built-casche' : {...storageSize['built-casche']}
        }))
        
        
        
        /*we want to add to the selectedTotal - selectedGridRowStorageSize - within here because this is the logic
        that controls whether we SELECT the row. */
         setSelectedGridRowStorageSize(currSelectedStorage => ({
           'running-containers': currSelectedStorage['running-containers'],
           'exited-containers': currSelectedStorage['exited-containers'],
           'paused-containers': currSelectedStorage['paused-containers'],
           'dangling-images': currSelectedStorage['dangling-images'],
           'in-use-images': currSelectedStorage['in-use-images'],
           'unused-images': currSelectedStorage['unused-images'],
           'built-casche': currSelectedStorage['built-casche'],
           'selectedTotal': currSelectedStorage['selectedTotal'] + currContainerStorage
         }))
         
        

      } else {
        //else user has unselected row. Remove the key/value pair from storageSizeById.
        const copyForContainer = {
        'running-containers': {...storageSizeById['running-containers']}, 
        'exited-containers': {...storageSizeById['exited-containers']}, 
        'paused-containers': {...storageSizeById['paused-containers']}, 
        'dangling-images': {...storageSizeById['dangling-images']}, 
        'in-use-images': {...storageSizeById['in-use-images']}, 
        'unused-images': {...storageSizeById['unused-images']}, 
        'built-casche': {...storageSizeById['built-casche']}
       };
       
       
        delete copyForContainer['exited-containers'][params.row.id]; 

        setStorageSizeById(imgStorageSize=>({
          ...copyForContainer
        }))

         /*we want to add to the selectedTotal - selectedGridRowStorageSize - within here because this is the logic
        that controls whether we UNSELECT the row. */
        setSelectedGridRowStorageSize(currSelectedStorage => ({
         'running-containers': currSelectedStorage['running-containers'],
         'exited-containers': currSelectedStorage['exited-containers'],
         'paused-containers': currSelectedStorage['paused-containers'],
         'dangling-images': currSelectedStorage['dangling-images'],
         'in-use-images': currSelectedStorage['in-use-images'],
         'unused-images': currSelectedStorage['unused-images'],
         'built-casche': currSelectedStorage['built-casche'],
         'selectedTotal': currSelectedStorage['selectedTotal'] - currContainerStorage
       }))
      }
      
    } else if (dataGridBlueButtonType === 'paused-containers'){
       //user has selected row in unused-containers
      
       const pausedContainerSizeStr = params.row.size; //storage size
       // console.log('unusedContainerSizeStr', checkBytesAndConvertToNumber(unusedContainerSizeStr))
       // const currbuiltCascheStorage = Math.trunc(Number(unusedContainerSizeStr.slice(0, length-2))); // storageSize converted to #
       const currContainerStorage = checkBytesAndConvertToNumber(pausedContainerSizeStr)
 
       //if image id is NOT in the object
       if(!storageSizeById['paused-containers'].hasOwnProperty(params.row.id)){
         //key is id and the value is the storage size 
         setStorageSizeById(storageSize => ({
           'running-containers': {...storageSize['running-containers']},
           'exited-containers': {...storageSize['exited-containers']},
           'paused-containers': {...storageSize['paused-containers'],[params.row.id] : currContainerStorage},
           'dangling-images': {...storageSize['dangling-images']},
           'in-use-images': {...storageSize['in-use-images']},
           'unused-images': {...storageSize['unused-images']},
           'built-casche' : {...storageSize['built-casche']}
         }))

         
 
         /*we want to add to the selectedTotal - selectedGridRowStorageSize - within here because this is the logic
         that controls whether we SELECT the row. */
          setSelectedGridRowStorageSize(currSelectedStorage => ({
            'running-containers': currSelectedStorage['running-containers'],
            'exited-containers': currSelectedStorage['exited-containers'],
            'paused-containers': currSelectedStorage['paused-containers'],
            'dangling-images': currSelectedStorage['dangling-images'],
            'in-use-images': currSelectedStorage['in-use-images'],
            'unused-images': currSelectedStorage['unused-images'],
            'built-casche': currSelectedStorage['built-casche'],
            'selectedTotal': currSelectedStorage['selectedTotal'] + currContainerStorage
          }))
          
         
 
       } else {
         //else user has unselected row. Remove the key/value pair from storageSizeById.
         const copyForContainer= {
         'running-containers': {...storageSizeById['running-containers']}, 
         'exited-containers': {...storageSizeById['exited-containers']}, 
         'paused-containers': {...storageSizeById['paused-containers']}, 
         'dangling-images': {...storageSizeById['dangling-images']}, 
         'in-use-images': {...storageSizeById['in-use-images']}, 
         'unused-images': {...storageSizeById['unused-images']}, 
         'built-casche': {...storageSizeById['built-casche']}
        };
        
        
         delete copyForContainer['paused-containers'][params.row.id]; 
 
         setStorageSizeById(imgStorageSize=>({
           ...copyForContainer
         }))
 
          /*we want to add to the selectedTotal - selectedGridRowStorageSize - within here because this is the logic
         that controls whether we UNSELECT the row. */
         setSelectedGridRowStorageSize(currSelectedStorage => ({
          'running-containers': currSelectedStorage['running-containers'],
          'exited-containers': currSelectedStorage['exited-containers'],
          'paused-containers': currSelectedStorage['paused-containers'],
          'dangling-images': currSelectedStorage['dangling-images'],
          'in-use-images': currSelectedStorage['in-use-images'],
          'unused-images': currSelectedStorage['unused-images'],
          'built-casche': currSelectedStorage['built-casche'],
          'selectedTotal': currSelectedStorage['selectedTotal'] - currContainerStorage
        }))
       }
       
      
      
    }  else if (dataGridBlueButtonType === 'running-containers'){
      //user has selected row in unused-containers
     
      const runningContainerSizeStr = params.row.size; //storage size
      // console.log('unusedContainerSizeStr', checkBytesAndConvertToNumber(unusedContainerSizeStr))
      // const currbuiltCascheStorage = Math.trunc(Number(unusedContainerSizeStr.slice(0, length-2))); // storageSize converted to #
      const currContainerStorage = checkBytesAndConvertToNumber(runningContainerSizeStr)

      //if image id is NOT in the object
      if(!storageSizeById['running-containers'].hasOwnProperty(params.row.id)){
        //key is id and the value is the storage size 
        setStorageSizeById(storageSize => ({
          'running-containers': {...storageSize['running-containers'],[params.row.id] : currContainerStorage},
          'exited-containers': {...storageSize['exited-containers']},
          'paused-containers': {...storageSize['paused-containers']},
          'dangling-images': {...storageSize['dangling-images']},
          'in-use-images': {...storageSize['in-use-images']},
          'unused-images': {...storageSize['unused-images']},
          'built-casche' : {...storageSize['built-casche']}
        }))

        

        /*we want to add to the selectedTotal - selectedGridRowStorageSize - within here because this is the logic
        that controls whether we SELECT the row. */
         setSelectedGridRowStorageSize(currSelectedStorage => ({
           'running-containers': currSelectedStorage['running-containers'],
           'exited-containers': currSelectedStorage['exited-containers'],
           'paused-containers': currSelectedStorage['paused-containers'],
           'dangling-images': currSelectedStorage['dangling-images'],
           'in-use-images': currSelectedStorage['in-use-images'],
           'unused-images': currSelectedStorage['unused-images'],
           'built-casche': currSelectedStorage['built-casche'],
           'selectedTotal': currSelectedStorage['selectedTotal'] + currContainerStorage
         }))
         
        

      } else {
        //else user has unselected row. Remove the key/value pair from storageSizeById.
        const copyForContainer = {
        'running-containers': {...storageSizeById['running-containers']}, 
        'exited-containers': {...storageSizeById['exited-containers']}, 
        'paused-containers': {...storageSizeById['paused-containers']}, 
        'dangling-images': {...storageSizeById['dangling-images']}, 
        'in-use-images': {...storageSizeById['in-use-images']}, 
        'unused-images': {...storageSizeById['unused-images']}, 
        'built-casche': {...storageSizeById['built-casche']}
       };
       
       
        delete copyForContainer['running-containers'][params.row.id]; 

        setStorageSizeById(imgStorageSize=>({
          ...copyForContainer
        }))

         /*we want to add to the selectedTotal - selectedGridRowStorageSize - within here because this is the logic
        that controls whether we UNSELECT the row. */
        setSelectedGridRowStorageSize(currSelectedStorage => ({
         'running-containers': currSelectedStorage['running-containers'],
         'exited-containers': currSelectedStorage['exited-containers'], 
         'paused-containers': currSelectedStorage['paused-containers'],
         'dangling-images': currSelectedStorage['dangling-images'],
         'in-use-images': currSelectedStorage['in-use-images'],
         'unused-images': currSelectedStorage['unused-images'],
         'built-casche': currSelectedStorage['built-casche'],
         'selectedTotal': currSelectedStorage['selectedTotal'] - currContainerStorage
       }))
      }
      
   }  else if(dataGridBlueButtonType === 'built-casche'){
      //No NEED TO HAVE THIS CALC FOR BUILT-CASCHE? 

      //user has selected row in 'built-casche'
       const builtCascheSizeStr = params.row.size; //storage size
       
       const currbuiltCascheStorage = Math.trunc(Number(builtCascheSizeStr.slice(0, length-2))); // storageSize converted to #
 
       //if image id is NOT in the object
       if(!storageSizeById['built-casche'].hasOwnProperty(params.row.id)){
         //key is id and the value is the storage size 
         setStorageSizeById(storageSize => ({
           'running-containers': {...storageSize['running-containers']},
           'exited-containers': {...storageSize['exited-containers']},
           'paused-containers': {...storageSize['paused-containers']},
           'dangling-images': {...storageSize['dangling-images']},
           'in-use-images': {...storageSize['in-use-images']},
           'unused-images': {...storageSize['unused-images']},
           'built-casche' : {...storageSize['built-casche'],[params.row.id] : currbuiltCascheStorage}
         }))
         
        

         /*we want to add to the selectedTotal - selectedGridRowStorageSize - within here because this is the logic
         that controls whether we SELECT the row. */
          setSelectedGridRowStorageSize(currSelectedStorage => ({
            'running-containers': currSelectedStorage['running-containers'],
            'exited-containers': currSelectedStorage['exited-containers'],
            'paused-containers': currSelectedStorage['paused-containers'],
            'dangling-images': currSelectedStorage['dangling-images'],
            'in-use-images': currSelectedStorage['in-use-images'],
            'unused-images': currSelectedStorage['unused-images'],
            'built-casche': currSelectedStorage['built-casche'],
            'selectedTotal': currSelectedStorage['selectedTotal'] + currbuiltCascheStorage
          }))
          
          
       } else {
         //else user has unselected row. Remove the key/value pair from storageSizeById.
         const copyForBuiltCasche = {
          'running-containers': {...storageSizeById['running-containers']}, 
          'exited-containers': {...storageSizeById['exited-containers']}, 
          'paused-containers': {...storageSizeById['paused-containers']}, 
          'dangling-images': {...storageSizeById['dangling-images']}, 
          'in-use-images': {...storageSizeById['in-use-images']}, 
          'unused-images': {...storageSizeById['unused-images']}, 
          'built-casche': {...storageSizeById['built-casche']}
        };
        
 
         delete copyForBuiltCasche['built-casche'][params.row.id]; 
 
         setStorageSizeById(imgStorageSize=>({
           ...copyForBuiltCasche
         }))

          /*we want to add to the selectedTotal - selectedGridRowStorageSize - within here because this is the logic
         that controls whether we UNSELECT the row. */
         setSelectedGridRowStorageSize(currSelectedStorage => ({
         'running-containers': currSelectedStorage['running-containers'],
         'exited-containers': currSelectedStorage['exited-containers'],
         'paused-containers': currSelectedStorage['paused-containers'],
         'dangling-images': currSelectedStorage['dangling-images'],
         'in-use-images': currSelectedStorage['in-use-images'],
         'unused-images': currSelectedStorage['unused-images'],
         'built-casche': currSelectedStorage['built-casche'],
         'selectedTotal': currSelectedStorage['selectedTotal'] - currbuiltCascheStorage
        }))
        
       }
    }
  };

  //Fires in general? Because the storage size is being filled.  YES IT DOES !!!
  //useEffect fires when we select or prune a dangling-image, unused-conatiner or built-casche
  //This useEffect is utilized to update our circular chart.
  //THIS MAY BE THE CONTAINER THAT HELPS US REFILL THE VALUES WITHIN THE DATA GRID? 
  useEffect(()=>{
    // we set the totalStorageTypes state with the most updated amount of storage size utilized by each type, ex: unused-containers, dangling images, etc. 
    // this shouldnt be called when we are only selecting but it is because everything is overlapping. Its also called everytime we render in general

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
          'exited-containers':  res.storage['exited-containers'], //EXITED
          'paused-containers': res.storage['paused-containers'], 
          'dangling-images':  res.storage['dangling-images'],
          'in-use-images': res.storage['in-use-images'],
          'unused-images': res.storage['unused-images'],
          'built-casche': res.storage['built-casche'],
          'combinedTotal':  res.storage['combinedTotal'], 
        })
       })

       
    //if the selected rows are within the dangling-images
    if(dataGridBlueButtonType === 'dangling-images'){
   
      //we get all the number values from the storageSizeById object in an array format
      const selectedImageCpuSizeArray = Object.values(storageSizeById['dangling-images']); //Example: [14,14,30]

      // console.log('selectedImageCpuSizeArray', selectedImageCpuSizeArray)

      //we sum up all these values using the reduce method
      const cpuUsageCalculation:any = selectedImageCpuSizeArray.reduce((sum: any, num: any)=> sum + num, 0); 

      const cpuUsageCalculationResult = setSelectedGridRowStorageSize({
        'running-containers': selectedGridRowStorageSize['running-containers'], 
        'exited-containers': selectedGridRowStorageSize['exited-containers'], 
        'paused-containers': selectedGridRowStorageSize['paused-containers'], 
        'dangling-images': cpuUsageCalculation,
        'in-use-images': selectedGridRowStorageSize['in-use-images'],
        'unused-images': selectedGridRowStorageSize['unused-images'],
        'built-casche': selectedGridRowStorageSize['built-casche'],
        'selectedTotal': selectedGridRowStorageSize['selectedTotal']
      }) 
      
      

    } else if(dataGridBlueButtonType === 'in-use-images'){
      // console.log('in-use-images in useEffect tracking storageSizeById')
       //we get all the number values from the storageSizeById object in an array format
       const selectedImageCpuSizeArray = Object.values(storageSizeById[ 'in-use-images']); //Example: [14,14,30]

       // console.log('selectedImageCpuSizeArray', selectedImageCpuSizeArray)
 
       //we sum up all these values using the reduce method
       const cpuUsageCalculation:any = selectedImageCpuSizeArray.reduce((sum: any, num: any)=> sum + num, 0); 
 
       const cpuUsageCalculationResult = setSelectedGridRowStorageSize({
         'running-containers': selectedGridRowStorageSize['running-containers'], 
         'exited-containers': selectedGridRowStorageSize['exited-containers'], 
         'paused-containers': selectedGridRowStorageSize['paused-containers'], 
         'dangling-images': selectedGridRowStorageSize['dangling-images'], 
         'in-use-images': cpuUsageCalculation,
         'unused-images': selectedGridRowStorageSize['unused-images'],
         'built-casche': selectedGridRowStorageSize['built-casche'],
         'selectedTotal': selectedGridRowStorageSize['selectedTotal']
       }) 
       
       
      
    } else if (dataGridBlueButtonType === 'unused-images') {

      // console.log('in-use-images in useEffect tracking storageSizeById')
       //we get all the number values from the storageSizeById object in an array format
       const selectedImageCpuSizeArray = Object.values(storageSizeById['unused-images']); //Example: [14,14,30]

       // console.log('selectedImageCpuSizeArray', selectedImageCpuSizeArray)
 
       //we sum up all these values using the reduce method
       const cpuUsageCalculation:any = selectedImageCpuSizeArray.reduce((sum: any, num: any)=> sum + num, 0); 
 
       const cpuUsageCalculationResult = setSelectedGridRowStorageSize({
         'running-containers': selectedGridRowStorageSize['running-containers'], 
         'exited-containers': selectedGridRowStorageSize['exited-containers'], 
         'paused-containers': selectedGridRowStorageSize['paused-containers'], 
         'dangling-images': selectedGridRowStorageSize['dangling-images'], 
         'in-use-images': selectedGridRowStorageSize['in-use-images'],
         'unused-images': cpuUsageCalculation,
         'built-casche': selectedGridRowStorageSize['built-casche'],
         'selectedTotal': selectedGridRowStorageSize['selectedTotal']
       }) 
      
       
      
    } else if(dataGridBlueButtonType === 'exited-containers'){

      // console.log('selected unused-container in prune useEffect that follows storageSizeById')
      // console.log('in-use-images in useEffect tracking storageSizeById')
       //we get all the number values from the storageSizeById object in an array format
       const selectedContainerCpuSizeArray = Object.values(storageSizeById['exited-containers']); //Example: [14,14,30]

       // console.log('selectedImageCpuSizeArray', selectedImageCpuSizeArray)
 
       //we sum up all these values using the reduce method
       const cpuUsageCalculation:any = selectedContainerCpuSizeArray.reduce((sum: any, num: any)=> sum + num, 0); 
 
       const cpuUsageCalculationResult = setSelectedGridRowStorageSize({
         'running-containers': selectedGridRowStorageSize['running-containers'], 
         'exited-containers': cpuUsageCalculation,
         'paused-containers': selectedGridRowStorageSize['paused-containers'], 
         'dangling-images': selectedGridRowStorageSize['dangling-images'], 
         'in-use-images': selectedGridRowStorageSize['in-use-images'], 
         'unused-images': selectedGridRowStorageSize['unused-images'], 
         'built-casche': selectedGridRowStorageSize['built-casche'],
         'selectedTotal': selectedGridRowStorageSize['selectedTotal']
       }) 
       
       
    } else if(dataGridBlueButtonType ===  'paused-containers'){
       
      // console.log('selected unused-container in prune useEffect that follows storageSizeById')
      // console.log('in-use-images in useEffect tracking storageSizeById')
       //we get all the number values from the storageSizeById object in an array format
       const selectedContainerCpuSizeArray = Object.values(storageSizeById[ 'paused-containers']); //Example: [14,14,30]

       // console.log('selectedImageCpuSizeArray', selectedImageCpuSizeArray)
 
       //we sum up all these values using the reduce method
       const cpuUsageCalculation:any = selectedContainerCpuSizeArray.reduce((sum: any, num: any)=> sum + num, 0); 
 
       const cpuUsageCalculationResult = setSelectedGridRowStorageSize({
         'running-containers': selectedGridRowStorageSize['running-containers'], 
         'exited-containers': selectedGridRowStorageSize['exited-containers'], 
         'paused-containers': cpuUsageCalculation,
         'dangling-images': selectedGridRowStorageSize['dangling-images'], 
         'in-use-images': selectedGridRowStorageSize['in-use-images'], 
         'unused-images': selectedGridRowStorageSize['unused-images'], 
         'built-casche': selectedGridRowStorageSize['built-casche'],
         'selectedTotal': selectedGridRowStorageSize['selectedTotal']
       }) 
       
       
    } else if(dataGridBlueButtonType ===  'running-containers'){
      
      // console.log('selected unused-container in prune useEffect that follows storageSizeById')
      // console.log('in-use-images in useEffect tracking storageSizeById')
       //we get all the number values from the storageSizeById object in an array format
       const selectedContainerCpuSizeArray = Object.values(storageSizeById['running-containers']); //Example: [14,14,30]

       // console.log('selectedImageCpuSizeArray', selectedImageCpuSizeArray)
 
       //we sum up all these values using the reduce method
       const cpuUsageCalculation:any = selectedContainerCpuSizeArray.reduce((sum: any, num: any)=> sum + num, 0); 
       
       const cpuUsageCalculationResult = setSelectedGridRowStorageSize({
         'running-containers': cpuUsageCalculation,
         'exited-containers': selectedGridRowStorageSize['exited-containers'], 
         'paused-containers': selectedGridRowStorageSize['paused-containers'], 
         'dangling-images': selectedGridRowStorageSize['dangling-images'], 
         'in-use-images': selectedGridRowStorageSize['in-use-images'], 
         'unused-images': selectedGridRowStorageSize['unused-images'], 
         'built-casche': selectedGridRowStorageSize['built-casche'],
         'selectedTotal': selectedGridRowStorageSize['selectedTotal']
       }) 
       
       
    } else if(dataGridBlueButtonType === 'built-casche'){
      //No NEED TO HAVE THIS CALC FOR BUILT-CASCHE? 

       //we get all the number values from the storageSizeById object in an array format
       const selectedImageCpuSizeArray = Object.values(storageSizeById['built-casche']); //Example: [14,14,30]
       //we sum up all these values using the reduce method
       //assumes images are only in megabytes, may have to consider kb, b or gb? Built casche has these values(mb,kb,b)
       const cpuUsageCalculation:any = selectedImageCpuSizeArray.reduce((sum: any, num: any)=> sum + num, 0); 
 

      const cpuUsageCalculationResult = setSelectedGridRowStorageSize({
        'running-containers': selectedGridRowStorageSize['running-containers'], 
        'exited-containers': selectedGridRowStorageSize['exited-containers'], 
        'paused-containers': selectedGridRowStorageSize['paused-containers'], 
        'dangling-images': selectedGridRowStorageSize['dangling-images'],
        'in-use-images': selectedGridRowStorageSize['in-use-images'],
        'unused-images': selectedGridRowStorageSize['unused-images'],
        'built-casche': cpuUsageCalculation,
        'selectedTotal': selectedGridRowStorageSize['selectedTotal']
      }) 
      
      // console.log('selected built-casche in prune useEffect that follows storageSizeById', storageSizeById)
    }
  }, [storageSizeById]);


  
  //function does pruning commands depending on prune state
  const pruningFunc = async (prune:String, selectedStorageArray:any = apiRef.current.getSelectedRows()) => {
 
    // console.log(selectedStorageArray)
    
    //the selectedImageArray contains an array of objects.
    //ex: [{ key:id, value:{} }]
    //ex: [{"4012d2bb7317": {id: '4012d2bb7317', size: '14.1MB', created: '7 minutes ago', status: '<none>', type: 'Image'}}]
    // console.log('selectedStorageArray', selectedStorageArray)
    
    if(prune === 'prune-all') {

    } else if(prune === 'prune-selected') {
      //we utilize the type field within the object to determine whether the key value pair represents and image, cache or container
      //we then split them up appropriately to be able to prune them with their associated commands. 
     let danglingImageIdsToRemove:any = [];
     let inUseImageIdsToRemove:any = [];
     let unusedImageIdsToRemove:any = [];
     let exitedContainerIdsToRemove:any = [];
     let pausedContainerIdsToRemove:any = [];
     let runningContainerIdsToRemove:any = [];
     let cascheIdsToRemove:any = []; 
     

    // console.log('storageSizeById image keys -> ids', Object.keys(storageSizeById['dangling-images']))
    // console.log('storageSizeById container keys -> ids', Object.keys(storageSizeById['unused-containers']))

    /*we loop through the keys of the storageSizeId which are the id's of each image, container etc. 
    by the time we are prune whatever selections we have made through clicking on rows would have filled
    the storageSizeById state object with key value pairs for all the types... unusedcontainer, dangling images etc.
    we want to be able to access each type and get an array of all the ids that are filled within them so we can
    run the pruning command on the ids of each type category on the code below this for loop. */
    for(let key in storageSizeById){
    //  console.log(key, 'storageSizeById[key]',storageSizeById[key])
     if(key === 'dangling-images'){
      //  console.log('dangling-image keys', Object.keys(storageSizeById[key]))
      danglingImageIdsToRemove = Object.keys(storageSizeById[key])
    } else if(key === 'in-use-images'){
      //  console.log('unused-contianer keys', Object.keys(storageSizeById[key]))
      inUseImageIdsToRemove= Object.keys(storageSizeById[key])
    } else if(key === 'unused-images'){
      unusedImageIdsToRemove= Object.keys(storageSizeById[key])
    } else if(key === 'exited-containers'){
      //  console.log('unused-contianer keys', Object.keys(storageSizeById[key]))
      exitedContainerIdsToRemove = Object.keys(storageSizeById[key])
    } else if(key === 'paused-containers'){
      //  console.log('unused-contianer keys', Object.keys(storageSizeById[key]))
      pausedContainerIdsToRemove = Object.keys(storageSizeById[key])
    } else if(key === 'running-containers'){
      //  console.log('unused-contianer keys', Object.keys(storageSizeById[key]))
      runningContainerIdsToRemove = Object.keys(storageSizeById[key])
    } 
    }


      
     //DANGLING IMAGES
     if(danglingImageIdsToRemove.length > 0){
       /* We then check if  imageIdsToRemove, containerIdsToRemove (which are the arrays of selected id) have
       a length greater than 1. If so we know to run the prunning commands on all the ids for each type*/
        await  ddClient.docker.cli.exec('rmi', [...danglingImageIdsToRemove])
       .catch((err)=>{
        //COMMAND BELOW UPDATES THE SELECTED ROWS TO THOSE PASSED TO THE ROWIDS ARG. ANY ROW ALREADY SELECTED WILL BE UNSELECTED
        apiRef.current.setRowSelectionModel([])
        console.log('error in dangling image prune command ... currently in use by container', 
        alert(`Error in dangling image prune command ${err.stderr}`)) 
        });
        //dangling-images prune
   
        //if we having a dangling image that is in use we cant prune it... the containers using it will have to be pruned
        //first. 
    
       danglingImageIdsToRemove = [];

         setStorageSizeById(storageSize => ({
          'running-containers':  {...storageSize['running-containers']},
          'exited-containers':  {...storageSize['exited-containers']},
          'paused-containers':  {...storageSize['paused-containers']},
          'dangling-images': {},
          'in-use-images':  {...storageSize[ 'in-use-images']},
          'unused-images':  {...storageSize[ 'unused-images']},
          'built-casche':  {...storageSize['built-casche']},
        }))
    } 

    
    //INUSE IMAGES
    if(inUseImageIdsToRemove.length > 0){
      await  ddClient.docker.cli.exec('rmi', [...inUseImageIdsToRemove])
      .catch((err)=>{
        //COMMAND BELOW UPDATES THE SELECTED ROWS TO THOSE PASSED TO THE ROWIDS ARG. ANY ROW ALREADY SELECTED WILL BE UNSELECTED
        apiRef.current.setRowSelectionModel([])
        console.log('error in in-use image prune command ... image is in use', 
        alert(`error in in-use image prune command ${err.stderr}`)) 
      });
       
       inUseImageIdsToRemove = [];

        setStorageSizeById(storageSize => ({
         'running-containers':  {...storageSize['running-containers']},
         'exited-containers':  {...storageSize['exited-containers']},
         'paused-containers':  {...storageSize['paused-containers']},
         'dangling-images':  {...storageSize['dangling-images']},
         'in-use-images':  {},
         'unused-images':  {...storageSize['unused-images']},
         'built-casche':  {...storageSize['built-casche']},
       }))
       
   }  

   //UNUSED IMAGES 
   if(unusedImageIdsToRemove.length > 0){
    
      await  ddClient.docker.cli.exec('rmi', [...unusedImageIdsToRemove])
      .catch((err)=>{
        //COMMAND BELOW UPDATES THE SELECTED ROWS TO THOSE PASSED TO THE ROWIDS ARG. ANY ROW ALREADY SELECTED WILL BE UNSELECTED
        apiRef.current.setRowSelectionModel([])
        console.log('error in unused image prune command ... image in use by container',
         alert(`error in in-use image prune command ${err.stderr}`)) 
      });
       
   
      unusedImageIdsToRemove = [];

        setStorageSizeById(storageSize => ({
         'running-containers':  {...storageSize['running-containers']},
         'exited-containers':  {...storageSize['exited-containers']},
         'paused-containers':  {...storageSize['paused-containers']},
         'dangling-images':  {...storageSize['dangling-images']},
         'in-use-images':  {...storageSize['in-use-images']},
         'unused-images':  {},
         'built-casche':  {...storageSize['built-casche']},
       }))
       
   }

   //EXITED CONTAINERS
   if(exitedContainerIdsToRemove.length > 0){

    await ddClient.docker.cli.exec('rm', [...exitedContainerIdsToRemove])
    .catch((err)=>{
      //COMMAND BELOW UPDATES THE SELECTED ROWS TO THOSE PASSED TO THE ROWIDS ARG. ANY ROW ALREADY SELECTED WILL BE UNSELECTED
      apiRef.current.setRowSelectionModel([])
      alert(`Error in container prune command ${err.stderr}`)});
    //unsued-container prune
  
    exitedContainerIdsToRemove = [];

    setStorageSizeById(storageSize => ({
      'running-containers':  {...storageSize['running-containers']},
      'exited-containers': {},
      'paused-containers':  {...storageSize['paused-containers']},
      'in-use-images':  {...storageSize['in-use-images']},
      'dangling-images': {...storageSize['dangling-images']},
      'unused-images': {...storageSize['unused-images']},
      'built-casche':  {...storageSize['built-casche']},
    }))
    
 }
  
 //Paused CONTAINERS
 if(pausedContainerIdsToRemove.length > 0){

  await ddClient.docker.cli.exec('rm', [...pausedContainerIdsToRemove])
  .catch((err)=>{
    //COMMAND BELOW UPDATES THE SELECTED ROWS TO THOSE PASSED TO THE ROWIDS ARG. ANY ROW ALREADY SELECTED WILL BE UNSELECTED
    apiRef.current.setRowSelectionModel([])
    console.log('Error in container prune command Error response from daemon: container is paused and must be unpaused first', 
    alert(`Error in container prune command ${err.stderr}`))});
  //unsued-container prune

  pausedContainerIdsToRemove = [];

  setStorageSizeById(storageSize => ({
    'running-containers': {...storageSize['running-containers']},
    'exited-containers': {...storageSize['exited-containers']},
    'paused-containers':  {},
    'in-use-images':  {...storageSize['in-use-images']},
    'dangling-images': {...storageSize['dangling-images']},
    'unused-images': {...storageSize['unused-images']},
    'built-casche':  {...storageSize['built-casche']},
  }))
  
}


 //RUNNING CONTAINERS
 if(runningContainerIdsToRemove.length > 0){

  await ddClient.docker.cli.exec('rm', [...runningContainerIdsToRemove])
  .catch((err)=>{
    //COMMAND BELOW UPDATES THE SELECTED ROWS TO THOSE PASSED TO THE ROWIDS ARG. ANY ROW ALREADY SELECTED WILL BE UNSELECTED
    apiRef.current.setRowSelectionModel([])
    console.log('Error in container prune command Error response from daemon: container is running: stop the container before removing or force remove', 
    alert(`Error in container prune command ${err.stderr}`))
  });
  //unsued-container prune

  runningContainerIdsToRemove = [];

  setStorageSizeById(storageSize => ({
    'running-containers':  {},
    'exited-containers': {...storageSize['exited-containers']},
    'paused-containers': {...storageSize['paused-containers']},
    'in-use-images':  {...storageSize['in-use-images']},
    'dangling-images': {...storageSize['dangling-images']},
    'unused-images': {...storageSize['unused-images']},
    'built-casche':  {...storageSize['built-casche']},
  }))
}
 
    
      //after pruning we need to reset the value within the selectedTotal key. This manages all selected rows from
      //all types - unused-containers, dangling-images and build-cache
        setSelectedGridRowStorageSize({
          'running-containers': selectedGridRowStorageSize['running-containers'],
          'exited-containers': selectedGridRowStorageSize['exited-containers'],
          'paused-containers': selectedGridRowStorageSize['paused-containers'],
          'dangling-images': selectedGridRowStorageSize['dangling-images'],
          'in-use-images': selectedGridRowStorageSize['in-use-images'],
          'unused-images': selectedGridRowStorageSize['unused-images'],
          'built-casche': selectedGridRowStorageSize['built-casche'],
          'selectedTotal': 0,
        })
      


      //resets the dataForGridRows state to an empty array
      setDataForGridRows([]);

     
      /*we have the conditional statement here because we want the grid to re-render the type we are in after clicking
      the selected prune button...dangling images, unused containers and builtcasche.. otherwise it could get 
      confusing if it re-renders back to dangling images everytime */

      if(dataGridBlueButtonType === 'dangling-images'){
          //since we reset the dataForGridRows state above we want to refill this state with the remaining images
          //so the dataGrid could fill the rows with the remaining data from the images.
     
           await GetAllStorage(ddClient, 'data').
           then(res => {    
           //  console.log('res.data', res.data['in-use-images'])
           setDataForGridRows(res.data['dangling-images'])
      })

      } else if(dataGridBlueButtonType === 'in-use-images'){

        await GetAllStorage(ddClient, 'data').
          then(res => {    
          setDataForGridRows(res.data['in-use-images'])
        }) 

      } else if (dataGridBlueButtonType === 'unused-images') {

        await GetAllStorage(ddClient, 'data').
        then(res => {    
        setDataForGridRows(res.data['unused-images'])
        })

      } else if(dataGridBlueButtonType === 'exited-containers'){ //EXITED Containers
       await ddClient.docker.cli.exec('ps', ['--all', '--format', '"{{json .}}"', '--filter', "status=exited"])
        .then((result) => {
          setDataForGridRows(result.parseJsonLines());
        })

      }  else if(dataGridBlueButtonType === 'running-containers'){ 
        await GetRunningContainers(ddClient).
        then(res => { 
          // console.log('running containers', res)   
        setDataForGridRows(res)
        })
 
       } else if(dataGridBlueButtonType === 'paused-containers'){ 
        await ddClient.docker.cli.exec('ps', ['--all', '--format', '"{{json .}}"', '--filter', "status=paused"])
         .then((result) => {
           setDataForGridRows(result.parseJsonLines());
         })
         //command populates all built casche
       } else if(dataGridBlueButtonType === 'built-casche'){
         await ddClient.docker.cli.exec('builder', ['du', '--verbose'])
         .then((result) => {
          // console.log('result.stdout within useEffect in prune file -->', result.stdout)
          // console.log('Parsed BuiltCascheRowDataParser(result) in prune useEffect', JSON.parse(BuiltCascheRowDataParser(result.stdout)))
          setDataForGridRows(JSON.parse(BuiltCascheRowDataParser(result.stdout)));
        })
      }  

     

   } else {
   }
   
  }

  //We are utilizing the rowColumnTypeHelper module to have a seperation of concerns. It will essentially
  //return the string we are looking for in the column or row of the datagrid. 

  //sets columns/headers in dataGrid 
   const columns: GridColDef[] = [
    { field: 'status', headerName: 'Status', width: 130 },
    { field: 'id', headerName: 'ID', width: 135 },
    { field: 'size', headerName: 'Size', width: 115},
    { field: 'created', headerName: 'Created', width: 135 },
    { field: 'RepoOrImage', headerName: rowColumnTypeHelper(dataGridBlueButtonType, 'col', 'RepoOrImage', {}), width: 145 },
    { field: 'TagOrName', headerName: rowColumnTypeHelper(dataGridBlueButtonType, 'col', 'TagOrName', {}),width: 135}, 
      //created a type field so we can utilize and be able to distinguish whether we are pruning 
      //a container, image or cache within the pruning function. The getSelectedRows() returns
      //an array of objects with these fields. We also need to distinguid because each type
      //has different pruning commands. 
    { field: 'type', headerName: 'Type', width: 130 },
  ];

  //sets row data in dataGrid 
  const rows: GridRowsProp =  dataForGridRows.map((type) => ({
    id:type.ID,
    size: dataGridBlueButtonType === 'exited-containers' ? containerVirtualSizeConverterToString(type.Size): 
    dataGridBlueButtonType === 'paused-containers' ? containerVirtualSizeConverterToString(type.Size) :
    dataGridBlueButtonType === 'running-containers' ? containerVirtualSizeConverterToString(type.Size): type.Size ,
    created:  rowColumnTypeHelper(dataGridBlueButtonType, 'row', 'created', type),
    TagOrName:  rowColumnTypeHelper(dataGridBlueButtonType, 'row', 'TagOrName', type),
    RepoOrImage:  rowColumnTypeHelper(dataGridBlueButtonType, 'row', 'RepoOrImage', type),
    status: rowColumnTypeHelper(dataGridBlueButtonType, 'row', 'status', type),
    type: rowColumnTypeHelper(dataGridBlueButtonType, 'row', 'type', type)

  }));


  

  //Build cache, in use images and paused containers are not selectable so we want to remove the checkboxes when we are in the rows of the buid cache
  function selectDataGrid (strType:any) {
    // console.log('strType', strType)
    if(strType === 'built-casche'){
        return <DataGrid 
        rows={rows} 
        columns={columns} 
        apiRef={apiRef} 
        sx={{
          "& .MuiDataGrid-columnHeaderCheckbox .MuiDataGrid-columnHeaderTitleContainer": {
            display: "none"
          }
        }}
        />
    } 

    else {
        return <DataGrid 
        rows={rows} 
        columns={columns} 
        checkboxSelection 
        apiRef={apiRef} 
        onCellClick={handleCellClick}
        keepNonExistentRowsSelected
        sx={{
          "& .MuiDataGrid-columnHeaderCheckbox .MuiDataGrid-columnHeaderTitleContainer": {
            display: "none"
          }
        }}
        />
    }
}


//THESE WERE IMPORTED AND ARE UTILIZED AS MEDIA QUERIES
//  const theme = useTheme();
const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 875,
      lg: 1200,
      xl: 1536,
    },
  },
});

 const matches = useMediaQuery(theme.breakpoints.up('md'));
 


  return (
    <>
        <Container
            sx={{
                width: matches === true ? '95vw' : '90vw',
                height: '85vh',
                bgcolor: blueGrey[50],
                display: 'flex',
                flexDirection: 'column',
                border:2,
                borderColor:'primary.main'
            }}>
          <Box 
          sx={{
            width: matches === true ? '90vw' : '85vw',
            height: '40vh',
            bgcolor: blueGrey[50],
            display: 'flex',
            justifyContent:'space-around',
            marginTop:4

        }}>
            <Box 
            sx={{
                bgcolor: blueGrey[50],
                width:'25%', 
                height:'90%',
                borderRadius: 2,
                border:2,
                borderColor:'primary.main',
                overflow: 'scroll'
            }}
            >
            <Stack>
           
        
            <ImageButtonComponent setDataGridBlueButtonType={setDataGridBlueButtonType} allImageAndContainerStorage={allImageAndContainerStorage} totalStorageTypes={totalStorageTypes}/>
           
            
            <ContainerButtonComponent setDataGridBlueButtonType={setDataGridBlueButtonType} allImageAndContainerStorage={allImageAndContainerStorage} totalStorageTypes={totalStorageTypes}/>

              { matches === true ? 

                <ButtonGroup variant="contained" aria-label="Basic button group" sx={{m:2}}> 
                <Button variant="contained"  onClick={()=>{setDataGridBlueButtonType('built-casche')}}>
                   Build Cache - β
                </Button>
                <Button variant="contained" onClick={()=>{}} sx={{color: '#FFD700'}}>
                {storageNumToStr(totalStorageTypes['built-casche'])}
                </Button>
                </ButtonGroup> 
                :
                <Button variant="contained"  onClick={()=>{setDataGridBlueButtonType('built-casche')}} sx={{m:2, marginBottom: 0}}>
                   Build Cache
                </Button>
              }
               
            </Stack>
            </Box>

            <Box sx={{
                width:'70%', 
                height:'90%',
                bgcolor: blueGrey[50],
                borderRadius: 2,
                border:2,
                borderColor:'primary.main',
                overflow: 'auto',
                // display: 'flex',
                // flexDirection: 'column',
                // alignItems: 'center'
                
                }}>
               
                <Box sx={{
                  color: 'primary.main',
                  fontWeight: 'bold',
                  fontStyle: 'italic',
                  textAlign: 'center',
                  marginTop: 1,
                  
                   
                }}
                >{dataGridTypeHeaderHelper(dataGridBlueButtonType)}
                </Box>

                <Box>
                {selectDataGrid(dataGridBlueButtonType)}
                </Box>
                
           </Box>
          </Box>
        
        

          <Box sx={{
            width: matches === true ? '90vw' : '85vw',
            height: matches === true ? '40vh' : '38vh',
            bgcolor: blueGrey[50],
            display: 'flex',
            justifyContent:'space-around',
        }}>

          <Box
            sx={{
            bgcolor: blueGrey[50],
            width:'25%', 
            height:'90%',
            borderRadius: 2,
            border:2,
            borderColor:'primary.main',
            overflow: 'scroll'
        }}> 

          <Stack>
            <PruneAllButtonComponent apiRef={apiRef} CLI={ddClient} setStorageSizeById={setStorageSizeById} selectedGridRowStorageSize ={selectedGridRowStorageSize} setSelectedGridRowStorageSize={setSelectedGridRowStorageSize} setDataForGridRows={setDataForGridRows} />
                
            { matches === true ? 
                <Button variant="contained" color='error' onClick={()=>{pruningFunc('prune-selected')}} sx={{
                    m:2,
                    p: 1,
                    borderRadius: 2,
                    
                     
                    }}>
                    Prune Selected
                </Button>
                :
                <Button variant="contained" color='error' onClick={()=>{pruningFunc('prune-selected')}} sx={{
                  m:2,
                  marginBottom:0,
                  p: 1,
                  borderRadius: 2,
                   
                  }}>
                  <Box sx={{display:'flex', flexDirection:'column'}}>
                    <Box>
                       Prune 
                    </Box>
                    <Box>
                      Selected
                    </Box>
                  </Box> 
              </Button>
              
                }

              { matches === true ? 
                <Button variant="contained" color='secondary'sx={{
                    m:2,
                    p: 1,
                    borderRadius: 2,
                
                }}>
                    Scheduled Prune - β
                </Button>
                :
                <Button variant="contained" color='secondary'sx={{
                  m:2,
                  marginBottom:0,
                  p: 1,
                  borderRadius: 2,
              
              }}>
                <Box sx={{display:'flex', flexDirection:'column'}}>
                    <Box>
                      Scheduled 
                    </Box>
                    <Box>
                      Prune - β
                    </Box>
                  </Box> 
              </Button>
              }

            </Stack>

          </Box>

          <Box
          sx={{
            width:'70%', 
            height:'90%',
            bgcolor: blueGrey[50],
            borderRadius: 2,
            border:2,
            borderColor:'primary.main',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            
            
            
        }}> 
            <ProgressbarChartComponent selectedTotal={selectedGridRowStorageSize['selectedTotal']} combinedTotal={totalStorageTypes['combinedTotal']}/>
            {/* {` Selected Storage: ${storageNumToStr(selectedGridRowStorageSize['selectedTotal'])}  / Total Storage: ${storageNumToStr(totalStorageTypes['combinedTotal'])} ` }         */}
            
            </Box>
          </Box>
        </Container>
    </>
  );
} 


