import { Box, Stack } from '@mui/material';
import { blueGrey } from '@mui/material/colors';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import { storageNumToStr } from '../../utilities/StorageNumtoStr';
import { ImageButtonComponent } from '../../modules/ImageButtonComponent';
import { ContainerButtonComponent } from '../../modules/ContainerButtonComponent';

//modules
import AllImageAndContainerStorage from '../../utilities/AllImageAndContainerStorage';
import GetAllStorage from '../../utilities/GetAllStorage/GetAllStorage';

//contextApi
import { CentralizedStateContext } from '../../context/CentralizedStateContext';
import { useContext, useEffect } from 'react';

//types
import { TotalStorageType, AllImageAndContainerStorageType, StorageSizeType} from '../../../types';

//Docker Desktop Client
import { createDockerDesktopClient } from '@docker/extension-api-client';

const client = createDockerDesktopClient();
function useDockerDesktopClient() {
  return client;
}




export function TopLeftComponent(props:any) {

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

      interface storageSizeByIdInterface { 
        storageSizeById: StorageSizeType
        setStorageSizeById :  (value: React.SetStateAction<StorageSizeType>) => void
      };
    
      const { storageSizeById, setStorageSizeById} = useContext<storageSizeByIdInterface>(CentralizedStateContext); 

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


      useEffect(()=>{
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
    
      },[storageSizeById]);

    return (
      
        <Box 
        sx={{
            bgcolor: blueGrey[50],
            width:'25%', 
            height:'90%',
            borderRadius: 2,
            border:2,
            borderColor:'primary.main',
            // borderColor:'yellow',
            overflow: 'scroll'
        }}
        >
        <Stack>
       
    
        <ImageButtonComponent setDataGridBlueButtonType={setDataGridBlueButtonType} allImageAndContainerStorage={allImageAndContainerStorage} totalStorageTypes={totalStorageTypes}/>
        <ContainerButtonComponent setDataGridBlueButtonType={setDataGridBlueButtonType} allImageAndContainerStorage={allImageAndContainerStorage} totalStorageTypes={totalStorageTypes}/>

          { props.matches === true ? 

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
    )
}

