import Modal from '@mui/material/Modal';
import React, { useEffect } from 'react';
import Button from '@mui/material/Button';
import { Box, } from '@mui/material';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import FormLabel from '@mui/material/FormLabel';
import GetAllStorage from '../modules/GetAllStorage/GetAllStorage';

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
    borderColor: 'primary.main'
  };

  
export function PruneAllButtonComponent(props:any) {
  // PROPS: apiRef={apiRef} CLI={ddClient} setStorageSizeById={setStorageSizeById} selectedGridRowStorageSize ={selectedGridRowStorageSize} setSelectedGridRowStorageSize={setSelectedGridRowStorageSize} setDataForGridRows={setDataForGridRows} 

    const [selectedTypes, SetSelectedTypes] = React.useState<{ [key: string]: any }>({
      'built-casche' : false, 
      'running-containers' : false,
      'paused-containers' : false, 
      'exited-containers' : false, 
      'in-use-images'  : false, 
      'dangling-images' : false, 
      'unused-images' : false 
    })

    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      SetSelectedTypes({
        ...selectedTypes,
        [event.target.name]: event.target.checked,
      });
    };

   const handleOnClick = async () => {
    
    for(let key in selectedTypes){
      if(selectedTypes[key]=== true){

        //************************************************************************************************************************

        if(key === 'exited-containers'){
          // console.log('Selected KEY', key)
          
          let exitedContainerIdSet = new Set();

          await props.CLI.docker.cli.exec('ps', ['--all', '--format', '"{{json .}}"', '--filter', "status=exited"])
           .then((result:any) => {
            const exitedContainers = result.parseJsonLines()
            exitedContainers.forEach((container:any) => {
              exitedContainerIdSet.add(container.ID)
            })
          })

           //prune all exited containers
           await props.CLI.docker.cli.exec('rm', [...exitedContainerIdSet])
           .catch((err:any)=>{
            //COMMAND BELOW UPDATES THE SELECTED ROWS TO THOSE PASSED TO THE ROWIDS ARG. ANY ROW ALREADY SELECTED WILL BE UNSELECTED
            props.apiRef.current.setRowSelectionModel([])
            alert(`Error in container prune command ${err.stderr}`)});

          props.setStorageSizeById((storageSize:any) => ({
            'running-containers':  {...storageSize['running-containers']},
            'exited-containers': {},
            'paused-containers': {...storageSize['paused-containers']},
            'in-use-images':  {...storageSize['in-use-images']},
            'dangling-images': {...storageSize['dangling-images']},
            'unused-images': {...storageSize['unused-images']},
            'built-casche':  {...storageSize['built-casche']},
          }))
          
       
          //after pruning we need to reset the value within the selectedTotal key. This manages all selected rows from
          //all types - unused-containers, dangling-images and build-cache
              props.setSelectedGridRowStorageSize({
                'running-containers': props.selectedGridRowStorageSize['running-containers'],
                'exited-containers': props.selectedGridRowStorageSize['exited-containers'],
                'paused-containers': props.selectedGridRowStorageSize['paused-containers'],
                'dangling-images': props.selectedGridRowStorageSize['dangling-images'],
                'in-use-images': props.selectedGridRowStorageSize['in-use-images'],
                'unused-images': props.selectedGridRowStorageSize['unused-images'],
                'built-casche': props.selectedGridRowStorageSize['built-casche'],
                'selectedTotal': 0,
              })
       
          //resets the dataForGridRows state to an empty array
            props.setDataForGridRows([]);
            

        }
        
        //************************************************************************************************************************

      if(key === 'dangling-images'){
        // console.log('Selected KEY', key)
        
        let danglingImageIdSet = new Set();

        await GetAllStorage(props.CLI, 'data').
          then(res => {    
            res.data['dangling-images'].forEach((image:any)=>{
              // console.log('images',image)
              danglingImageIdSet.add(image.ID)
            })
          })

         //prune all Dangling Images
         await props.CLI.docker.cli.exec('rmi', [...danglingImageIdSet])
         .catch((err:any)=>{
          //COMMAND BELOW UPDATES THE SELECTED ROWS TO THOSE PASSED TO THE ROWIDS ARG. ANY ROW ALREADY SELECTED WILL BE UNSELECTED
          props.apiRef.current.setRowSelectionModel([])
          console.log('Unable to prune... Dangling Image is being utilized by container',
           alert(`Error in container prune command ${err.stderr}`))
          });

        props.setStorageSizeById((storageSize:any) => ({
          'running-containers':  {...storageSize['running-containers']},
          'exited-containers': {...storageSize['running-containers']},
          'paused-containers': {...storageSize['paused-containers']},
          'in-use-images':  {...storageSize['in-use-images']},
          'dangling-images': {},
          'unused-images': {...storageSize['unused-images']},
          'built-casche':  {...storageSize['built-casche']},
        }))
        
     
        //after pruning we need to reset the value within the selectedTotal key. This manages all selected rows from
        //all types - unused-containers, dangling-images and build-cache
            props.setSelectedGridRowStorageSize({
              'running-containers': props.selectedGridRowStorageSize['running-containers'],
              'exited-containers': props.selectedGridRowStorageSize['exited-containers'],
              'paused-containers': props.selectedGridRowStorageSize['paused-containers'],
              'dangling-images': props.selectedGridRowStorageSize['dangling-images'],
              'in-use-images': props.selectedGridRowStorageSize['in-use-images'],
              'unused-images': props.selectedGridRowStorageSize['unused-images'],
              'built-casche': props.selectedGridRowStorageSize['built-casche'],
              'selectedTotal': 0,
            })
     
        //resets the dataForGridRows state to an empty array
          props.setDataForGridRows([]);
            
      }

      //************************************************************************************************************************

      if(key === 'unused-images'){
        // console.log('Selected KEY', key)
        
        let unusedImageIdSet = new Set();

        await GetAllStorage(props.CLI, 'data').
          then(res => {    
            res.data['unused-images'].forEach((image:any)=>{
              // console.log('images',image)
              unusedImageIdSet.add(image.ID)
            })
          })
    

         //prune all unused images
         await props.CLI.docker.cli.exec('rmi', [...unusedImageIdSet])
         .catch((err:any)=>{
          //COMMAND BELOW UPDATES THE SELECTED ROWS TO THOSE PASSED TO THE ROWIDS ARG. ANY ROW ALREADY SELECTED WILL BE UNSELECTED
          props.apiRef.current.setRowSelectionModel([])
          console.log('Unable to prune... Unused Image is being utilized by container',
          alert(`Error in unused image prune command ${err.stderr}`))});

        props.setStorageSizeById((storageSize:any) => ({
          'running-containers':  {...storageSize['running-containers']},
          'exited-containers': {...storageSize['running-containers']},
          'paused-containers': {...storageSize['paused-containers']},
          'in-use-images':  {...storageSize['in-use-images']},
          'dangling-images': {...storageSize['dangling-images']},
          'unused-images': {},
          'built-casche':  {...storageSize['built-casche']},
        }))
        
     
        //after pruning we need to reset the value within the selectedTotal key. This manages all selected rows from
        //all types - unused-containers, dangling-images and build-cache
            props.setSelectedGridRowStorageSize({
              'running-containers': props.selectedGridRowStorageSize['running-containers'],
              'exited-containers': props.selectedGridRowStorageSize['exited-containers'],
              'paused-containers': props.selectedGridRowStorageSize['paused-containers'],
              'dangling-images': props.selectedGridRowStorageSize['dangling-images'],
              'in-use-images': props.selectedGridRowStorageSize['in-use-images'],
              'unused-images': props.selectedGridRowStorageSize['unused-images'],
              'built-casche': props.selectedGridRowStorageSize['built-casche'],
              'selectedTotal': 0,
            })
     
        //resets the dataForGridRows state to an empty array
          props.setDataForGridRows([]);
      }


      //************************************************************************************************************************

      }
    }

    //CLOSES MODEL
    setOpen(false);
    
   }

    return (
        <>
        <Button variant="contained" color='error' onClick={()=>{handleOpen()}} sx={{
                    m:2,
                    p: 1,
                    borderRadius: 2
                    }}>
                    Prune All
                </Button> 
                <Modal
                  open={open}
                  onClose={()=>{handleClose()}}
                  aria-labelledby="modal-modal-title"
                  aria-describedby="modal-modal-description"
>
 
                    <Box sx={style}>
                    <FormLabel sx={{color: 'primary.main'}}component="legend">Images</FormLabel>
                    <FormGroup>
                     <FormControlLabel control={<Checkbox disabled  />} label="In Use Images - Beta" name='in-use-images'/>
                     <FormControlLabel control={<Checkbox onChange={handleChange} />}  label="Dangling Images" name='dangling-images'/>
                     <FormControlLabel control={<Checkbox onChange={handleChange} />}  label="Unused Images" name='unused-images' />
                     </FormGroup>
                     <FormLabel sx={{color: 'primary.main'}}component="legend">Containers</FormLabel>
                    <FormGroup>
                     <FormControlLabel control={<Checkbox disabled  />} label="Running Containers - Beta" name='running-containers'/>
                     <FormControlLabel control={<Checkbox onChange={handleChange} />}  label="Exited Containers" name= 'exited-containers'/>
                     <FormControlLabel control={<Checkbox disabled />}  label="Paused Containers - Beta" name='paused-containers'/>
                     </FormGroup>
                     <FormLabel sx={{color: 'primary.main'}}component="legend">Cache</FormLabel>
                     <FormControlLabel control={<Checkbox disabled  />}  label="Build Cache - Beta" name='built-casche'/>

                       <Box sx={{ width:'100%', display:'flex', justifyContent:'center'}}>
                          <Button variant="contained" color='error' onClick={handleOnClick} sx={{
                             m:2,
                             p: 1,
                             borderRadius: 2,
                             width:'100%'
                             }}>
                            Prune All
                          </Button> 
                       </Box>
                    </Box>
                    </Modal>
       
        </>
    )
}


 