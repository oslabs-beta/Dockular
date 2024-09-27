import { Box, Stack } from "@mui/system"
import Button from '@mui/material/Button';
import { PruneAllButtonComponent } from "../../modules/PruneAllButtonComponent";
import { blueGrey } from '@mui/material/colors';
import { createDockerDesktopClient } from '@docker/extension-api-client';

//modules
import GetAllStorage from '../../utilities/GetAllStorage/GetAllStorage';
import GetRunningContainers from '../../utilities/GetAllStorage/GetRunningContainers';
import { BuiltCascheRowDataParser } from '../../utilities/builtCascheRowDataParser';

//contextApi
import { CentralizedStateContext } from '../../context/CentralizedStateContext';
import { useContext } from 'react';

//TYPES
import { ImageType, StorageSizeType, SelectedRowSizeType, ContainerType, BuildCacheType } from '../../../types';

//Docker Desktop Client
const client = createDockerDesktopClient();
function useDockerDesktopClient() {
  return client;
}

export function BottomLeftComponent(props:any) {

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
    
    

    const pruningFunc = async (prune:String ) => {
 
        
        if(prune === 'prune-all') {
    
        } else if(prune === 'prune-selected') {
          //we utilize the type field within the object to determine whether the key value pair represents and image, cache or container
          //we then split them up appropriately to be able to prune them with their associated commands. 
         let danglingImageIdsToRemove:string[] = [];
         let inUseImageIdsToRemove:string[] = [];
         let unusedImageIdsToRemove:string[] = [];
         let exitedContainerIdsToRemove:string[] = [];
         let pausedContainerIdsToRemove:string[] = [];
         let runningContainerIdsToRemove:string[] = [];
         let cascheIdsToRemove:string[] = []; 
         
    
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
            await ddClient.docker.cli.exec('rmi', [...danglingImageIdsToRemove])
           .catch((err:any)=>{
            //COMMAND BELOW UPDATES THE SELECTED ROWS TO THOSE PASSED TO THE ROWIDS ARG. ANY ROW ALREADY SELECTED WILL BE UNSELECTED
            props.apiRef.current.setRowSelectionModel([])
            console.log('error in dangling image prune command ... currently in use by container', 
            alert(`Error in dangling image prune command ${err.stderr}`)) 
            });
            //dangling-images prune
       
            //if we having a dangling image that is in use we cant prune it... the containers using it will have to be pruned
            //first. 
        
           danglingImageIdsToRemove = [];
    
             setStorageSizeById(storageSize => ({
              ...storageSize,
              'dangling-images': {},
            }))
        } 
    
        
        //INUSE IMAGES
        if(inUseImageIdsToRemove.length > 0){
          await ddClient.docker.cli.exec('rmi', [...inUseImageIdsToRemove])
          .catch((err:any)=>{
            //COMMAND BELOW UPDATES THE SELECTED ROWS TO THOSE PASSED TO THE ROWIDS ARG. ANY ROW ALREADY SELECTED WILL BE UNSELECTED
            props.apiRef.current.setRowSelectionModel([])
            console.log('error in in-use image prune command ... image is in use', 
            alert(`error in in-use image prune command ${err.stderr}`)) 
          });
           
           inUseImageIdsToRemove = [];
    
            setStorageSizeById(storageSize => ({
              ...storageSize,
             'in-use-images':  {},
           }))
           
       }  
    
       //UNUSED IMAGES 
       if(unusedImageIdsToRemove.length > 0){
        
          await ddClient.docker.cli.exec('rmi', [...unusedImageIdsToRemove])
          .catch((err:any)=>{
            //COMMAND BELOW UPDATES THE SELECTED ROWS TO THOSE PASSED TO THE ROWIDS ARG. ANY ROW ALREADY SELECTED WILL BE UNSELECTED
            props.apiRef.current.setRowSelectionModel([])
            console.log('error in unused image prune command ... image in use by container',
             alert(`error in in-use image prune command ${err.stderr}`)) 
          });
           
       
          unusedImageIdsToRemove = [];
    
            setStorageSizeById(storageSize => ({
              ...storageSize,
             'unused-images':  {},
           }))
           
       }
    
       //EXITED CONTAINERS
       if(exitedContainerIdsToRemove.length > 0){
    
        await ddClient.docker.cli.exec('rm', [...exitedContainerIdsToRemove])
        .catch((err:any)=>{
          //COMMAND BELOW UPDATES THE SELECTED ROWS TO THOSE PASSED TO THE ROWIDS ARG. ANY ROW ALREADY SELECTED WILL BE UNSELECTED
          props.apiRef.current.setRowSelectionModel([])
          alert(`Error in container prune command ${err.stderr}`)});
        //unsued-container prune
      
        exitedContainerIdsToRemove = [];
    
        setStorageSizeById(storageSize => ({
          ...storageSize,
          'exited-containers': {},
        }))
        
     }
      
     //Paused CONTAINERS
     if(pausedContainerIdsToRemove.length > 0){
    
      await ddClient.docker.cli.exec('rm', [...pausedContainerIdsToRemove])
      .catch((err:any)=>{
        //COMMAND BELOW UPDATES THE SELECTED ROWS TO THOSE PASSED TO THE ROWIDS ARG. ANY ROW ALREADY SELECTED WILL BE UNSELECTED
        props.apiRef.current.setRowSelectionModel([])
        console.log('Error in container prune command Error response from daemon: container is paused and must be unpaused first', 
        alert(`Error in container prune command ${err.stderr}`))});
      //unsued-container prune
    
      pausedContainerIdsToRemove = [];
    
      setStorageSizeById(storageSize => ({
        ...storageSize,
        'paused-containers':  {},
      }))
      
    }
    
    
     //RUNNING CONTAINERS
     if(runningContainerIdsToRemove.length > 0){
    
      await ddClient.docker.cli.exec('rm', [...runningContainerIdsToRemove])
      .catch((err:any)=>{
        //COMMAND BELOW UPDATES THE SELECTED ROWS TO THOSE PASSED TO THE ROWIDS ARG. ANY ROW ALREADY SELECTED WILL BE UNSELECTED
        props.apiRef.current.setRowSelectionModel([])
        console.log('Error in container prune command Error response from daemon: container is running: stop the container before removing or force remove', 
        alert(`Error in container prune command ${err.stderr}`))
      });
      //unsued-container prune
    
      runningContainerIdsToRemove = [];
    
      setStorageSizeById(storageSize => ({
        ...storageSize,
        'running-containers':  {}
      }))
    }
     
        
          //after pruning we need to reset the value within the selectedTotal key. This manages all selected rows from
          //all types - unused-containers, dangling-images and build-cache
            setSelectedGridRowStorageSize({
              ...selectedGridRowStorageSize,
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
            .then((result:any) => {
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
             .then((result:any) => {
               setDataForGridRows(result.parseJsonLines());
             })
             //command populates all built casche
           } else if(dataGridBlueButtonType === 'built-casche'){
             await ddClient.docker.cli.exec('builder', ['du', '--verbose'])
             .then((result:any) => {
              // console.log('result.stdout within useEffect in prune file -->', result.stdout)
              // console.log('Parsed BuiltCascheRowDataParser(result) in prune useEffect', JSON.parse(BuiltCascheRowDataParser(result.stdout)))
              setDataForGridRows(JSON.parse(BuiltCascheRowDataParser(result.stdout)));
            })
          }  
       }  
    }
    
   
    return (
 
         <Box
            sx={{
            bgcolor: blueGrey[50],
            width:'25%', 
            height:'90%',
            borderRadius: 2,
            border:2,
            borderColor:'primary.main',
            // borderColor: 'yellow',
            overflow: 'scroll'
        }}> 

          <Stack>

            <PruneAllButtonComponent apiRef={props.apiRef} CLI={ddClient} setStorageSizeById={setStorageSizeById} selectedGridRowStorageSize ={selectedGridRowStorageSize} setSelectedGridRowStorageSize={setSelectedGridRowStorageSize} dataForGridRows={dataForGridRows} setDataForGridRows={setDataForGridRows} />
            
            { props.matches === true ? 
                <Button variant="contained" color='error' onClick={ ()=>{pruningFunc('prune-selected')} } sx={{
                    m:2,
                    p: 1,
                    borderRadius: 2, 
                    }}>
                    Prune Selected
                </Button>
                :
                <Button variant="contained" color='error' onClick={()=>{  pruningFunc('prune-selected')}} sx={{
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

              { props.matches === true ? 
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
    )
}

