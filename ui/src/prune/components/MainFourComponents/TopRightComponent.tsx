import { Box } from '@mui/material';
import { blueGrey } from '@mui/material/colors';
import { useEffect } from 'react';
import { createDockerDesktopClient } from '@docker/extension-api-client';

//Mui Grid
import { DataGrid, GridRowsProp, GridColDef, GridEventListener} from '@mui/x-data-grid';
import { GridCellParams } from '@mui/x-data-grid';

//modules
import { dataGridTypeHeaderHelper } from '../../modules/dataGridTypeHeaderHelper';
import { containerVirtualSizeConverterToString } from '../../modules/ContainerVirtualSizeConverterToString';
import { rowColumnTypeHelper } from '../../modules/GetAllStorage/rowColumnTypeHelper';
import { BuiltCascheRowDataParser } from '../../modules/builtCascheRowDataParser';
import GetRunningContainers from '../../modules/GetAllStorage/GetRunningContainers';
import AllImageAndContainerStorage from '../../modules/AllImageAndContainerStorage';
import GetAllStorage from '../../modules/GetAllStorage/GetAllStorage';

//utilites
import { checkBytesAndConvertToNumber } from '../../utilities/ CheckBytesAndConvertToNumber';

//Docker Desktop Client
const client = createDockerDesktopClient();
function useDockerDesktopClient() {
  return client;
}

//contextApi
import { CentralizedStateContext } from '../../context/CentralizedStateContext';
import { useContext } from 'react';

//TYPES
import { ImageType, StorageSizeType, SelectedRowSizeType, TotalStorageType, AllImageAndContainerStorageType, ContainerType, BuildCacheType } from '../../../types';


export function TopRightComponent(props:any) {

 const ddClient = useDockerDesktopClient();


  interface dataGridBlueButtonTypeInterface {
    dataGridBlueButtonType: string,
    setDataGridBlueButtonType :React.Dispatch<React.SetStateAction<string>>
  }
  
  const {dataGridBlueButtonType, setDataGridBlueButtonType} = useContext<dataGridBlueButtonTypeInterface>(CentralizedStateContext)


  type dataForGridRowType = ImageType[] | ContainerType[] | BuildCacheType[]; 

  interface dataForGridRowsInterface {
    dataForGridRows: dataForGridRowType,
    setDataForGridRows: React.Dispatch<React.SetStateAction<dataForGridRowType>>
  }

  const {dataForGridRows, setDataForGridRows} = useContext<dataForGridRowsInterface>(CentralizedStateContext)


  interface storageSizeByIdInterface { 
    storageSizeById: StorageSizeType
    setStorageSizeById :  (value: React.SetStateAction<StorageSizeType>) => void
  };

  const { storageSizeById, setStorageSizeById} = useContext<storageSizeByIdInterface>(CentralizedStateContext); 


  interface selectedGridRowStorageSizeInterface {
    selectedGridRowStorageSize: SelectedRowSizeType,
    setSelectedGridRowStorageSize :React.Dispatch<React.SetStateAction<SelectedRowSizeType>>
  }
  const { selectedGridRowStorageSize, setSelectedGridRowStorageSize} = useContext<selectedGridRowStorageSizeInterface>(CentralizedStateContext); 

  interface allImageAndContainerStorageInterface {
    allImageAndContainerStorage: AllImageAndContainerStorageType,
    setAllImageAndContainerStorage: React.Dispatch<React.SetStateAction<AllImageAndContainerStorageType>>
  }
  const {allImageAndContainerStorage, setAllImageAndContainerStorage} = useContext<allImageAndContainerStorageInterface>(CentralizedStateContext); 

  interface totalStorageTypesInterface {
    totalStorageTypes :  TotalStorageType,
    setTotalStorageTypes: React.Dispatch<React.SetStateAction<TotalStorageType>>
  }

  const {totalStorageTypes, setTotalStorageTypes} = useContext<totalStorageTypesInterface>(CentralizedStateContext); 


  
   
  //keeps track of state change in dataGridBlueButtonType and changes state in dataForGridRows state depending on selection of dangling-images,unused-container, or built casche
  useEffect(()=>{
    
    //command populates all dangling images
     if (dataGridBlueButtonType === 'dangling-images'){
       
      GetAllStorage(ddClient, 'data').
      then(res => {    
      setDataForGridRows(res.data['dangling-images'])
      })
      // .catch((err)=>{`Error in second use Effect tracking dataGridBlueButtonType within prune.tsx (DANGLING IMAGES) - Docker command in: GetAllStorage module ${err}`}) 

      //COMMAND POPULATES UNUSED IMAGES
     } else if(dataGridBlueButtonType === 'unused-images') {
      GetAllStorage(ddClient, 'data').
      then(res => {    

        // console.log("res.data['unused-images']", res.data['unused-images']); 

      setDataForGridRows(res.data['unused-images'])
      })
      // .catch((err)=>{`Error in second use Effect tracking dataGridBlueButtonType within prune.tsx (UNUSED IMAGES) - Docker command in: GetAllStorage module ${err}`})  

    //command populates all 'in-use-images'
    } else if(dataGridBlueButtonType === 'in-use-images'){

      GetAllStorage(ddClient, 'data').
      then(res => {    
        // console.log(res)
      setDataForGridRows(res.data['in-use-images'])
      
      })
      // .catch((err)=>{`Error in second use Effect tracking dataGridBlueButtonType within prune.tsx (IN USE IMAGES) - Docker command in: GetAllStorage module${err}`})  

      //EXITED CONTAINERS 
    } else if(dataGridBlueButtonType === 'exited-containers'){
        ddClient.docker.cli.exec('ps', ['--all', '--format', '"{{json .}}"', '--filter', "status=exited"])
        .then((result) => {
          // console.log('psAll',result.parseJsonLines())
          setDataForGridRows(result.parseJsonLines());
          
        })
        // .catch((err)=>{`Error in second use Effect tracking dataGridBlueButtonType within prune.tsx (EXITED CONTAINERS) - command: ddClient.docker.cli.exec('ps', ['--all', '--format', '"{{json .}}"', '--filter', "status=exited"]) ${err}`})

          //Paused Containers
      } else if(dataGridBlueButtonType === 'paused-containers'){
        ddClient.docker.cli.exec('ps', ['--all', '--format', '"{{json .}}"', '--filter', "status=paused"])
        .then((result) => {
          // console.log('psAll',result.parseJsonLines())
          const pausedContainers:ContainerType[] = result.parseJsonLines()
          setDataForGridRows(pausedContainers);
          
        })
        // .catch((err)=>{`Error in second use Effect tracking dataGridBlueButtonType within prune.tsx (PAUSED CONTAINERS) - command: ddClient.docker.cli.exec('ps', ['--all', '--format', '"{{json .}}"', '--filter', "status=exited"]) ${err}`})

        //RUNNING CONTAINERS
      }else if(dataGridBlueButtonType === 'running-containers'){
        GetRunningContainers(ddClient)
        .then(result => { 
          // console.log('running containers', res)   
        setDataForGridRows(result)
        })
        // .catch((err)=>{`Error in second use Effect tracking dataGridBlueButtonType within prune.tsx (RUNNING CONTAINERS) Docker command in: GetRunningContainers module ${err}`})  
       
        //command populates all built casche
      }else if(dataGridBlueButtonType === 'built-casche'){
        ddClient.docker.cli.exec('builder', ['du', '--verbose'])
        .then((result) => {
          // console.log('result.stdout within useEffect in prune file -->', result.stdout)
          // console.log('Parsed BuiltCascheRowDataParser(result) in prune useEffect', JSON.parse(BuiltCascheRowDataParser(result.stdout)))
          setDataForGridRows(JSON.parse(BuiltCascheRowDataParser(result.stdout)));
        })
        // .catch((err)=>{`Error in use Effect within prune.tsx for BUILD CACHE - command: ddClient.docker.cli.exec('builder', ['du', '--verbose']) ${err}`})
      }  
      
  },[dataGridBlueButtonType])


    //This eventListener helps us keep track of the boxes selected/unselected in the grid by id and the size of each image based off id
  const handleCellClick: GridEventListener<'cellClick'> = (params: GridCellParams<any>) => {
    // const handleCellClick: GridEventListener<'cellClick'> = (params: GridCellParams<cellParam>) => {

  // const handleRowClick: GridEventListener<'rowClick'> = (params) => {
  // console.log('params', params)
  
  if(dataGridBlueButtonType === 'dangling-images'){

    //user has selected row in dangling-images
    const imageStorageSize:string = params.row.size; //storage size
    
    
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
    const imageStorageSize:string = params.row.size; //storage size
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
    const imageStorageSize:string = params.row.size; //storage size
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
    
    const unusedContainerSizeStr:string = params.row.size; //storage size
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
    
     const pausedContainerSizeStr:string = params.row.size; //storage size
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
   
    const runningContainerSizeStr:string = params.row.size; //storage size
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
     const builtCascheSizeStr:string = params.row.size; //storage size
     
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
      const cpuUsageCalculation:number = selectedImageCpuSizeArray.reduce((sum: number, num: number)=> sum + num, 0); 

      // console.log('cpuUsageCalculation', cpuUsageCalculation)

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
       const cpuUsageCalculation:number = selectedImageCpuSizeArray.reduce((sum: number, num: number)=> sum + num, 0); 
 
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
       const cpuUsageCalculation:number = selectedImageCpuSizeArray.reduce((sum: number, num: number)=> sum + num, 0); 
 
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
       const cpuUsageCalculation:number = selectedContainerCpuSizeArray.reduce((sum: number, num: number)=> sum + num, 0); 
 
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
       const cpuUsageCalculation:number = selectedContainerCpuSizeArray.reduce((sum: number, num: number)=> sum + num, 0); 
 
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
       const cpuUsageCalculation:number = selectedContainerCpuSizeArray.reduce((sum: number, num: number)=> sum + num, 0); 
       
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
       const cpuUsageCalculation:number = selectedImageCpuSizeArray.reduce((sum: number, num: number)=> sum + num, 0); 
 

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


    //We are utilizing the rowColumnTypeHelper module to have a seperation of concerns. It will essentially
  //return the string we are looking for in the column or row of the datagrid. 

  //sets columns/headers in dataGrid 
   const columns: GridColDef[] = [
    { field: 'status', headerName: 'Status', width: 130 },
    { field: 'id', headerName: 'ID', width: 135 },
    { field: 'size', headerName: 'Size', width: 115},
    { field: 'created', headerName: 'Created', width: 135 },
    { field: 'RepoOrImage', headerName: rowColumnTypeHelper(dataGridBlueButtonType, 'col', 'RepoOrImage', {} ), width: 145 },
    { field: 'TagOrName', headerName: rowColumnTypeHelper(dataGridBlueButtonType, 'col', 'TagOrName', {} ),width: 135}, 
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
  function selectDataGrid (strType:string) {
    // console.log('strType', strType)
    if(strType === 'built-casche'){
        return <DataGrid 
        rows={rows} 
        columns={columns} 
        apiRef={props.apiRef} 
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
        apiRef={props.apiRef} 
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

    return (
      
        <Box sx={{
            width:'70%', 
            height:'90%',
            bgcolor: blueGrey[50],
            borderRadius: 2,
            border:2,
            borderColor:'primary.main',
            // borderColor:'yellow',
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
    )
}

