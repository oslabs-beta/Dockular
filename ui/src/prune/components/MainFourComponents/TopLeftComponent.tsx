import { Box, Stack } from '@mui/material';
import { blueGrey } from '@mui/material/colors';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';

//components
import { ImageButtonComponent } from '../ImageButtonComponent';
import { ContainerButtonComponent } from '../ContainerButtonComponent';

//utility
import { storageNumToStr } from '../../utilities/StorageNumtoStr';

//contextApi
import { CentralizedStateContext } from '../../context/CentralizedStateContext';
import { useContext } from 'react';

//types
import { TotalStorageType, AllImageAndContainerStorageType } from '../../../types';


export function TopLeftComponent(props:any) {
   
    interface dataGridBlueButtonTypeInterface {
        dataGridBlueButtonType: string,
        setDataGridBlueButtonType :React.Dispatch<React.SetStateAction<string>>
      }
      const {dataGridBlueButtonType, setDataGridBlueButtonType} = useContext<dataGridBlueButtonTypeInterface>(CentralizedStateContext)

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

