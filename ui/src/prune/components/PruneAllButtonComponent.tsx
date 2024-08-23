import Modal from '@mui/material/Modal';
import React, { useEffect } from 'react';
import Button from '@mui/material/Button';
import { Box, } from '@mui/material';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import FormLabel from '@mui/material/FormLabel';
import GetAllStorage from '../modules/GetAllStorage/GetAllStorage';
import useMediaQuery from '@mui/material/useMediaQuery';
import { createTheme } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';

import { StorageSizeType, SelectedRowSizeType, ImageType, ContainerType, BuildCacheType} from '../../types';
type dataForGridRowType = ImageType[] | ContainerType[] | BuildCacheType[]

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


  interface PruneAllButtonComponentProps {
    apiRef: any,
    CLI : any, 
    setStorageSizeById: React.Dispatch<React.SetStateAction<StorageSizeType>>,
    selectedGridRowStorageSize: SelectedRowSizeType,
    setSelectedGridRowStorageSize: React.Dispatch<React.SetStateAction<SelectedRowSizeType>>,
    setDataForGridRows:  React.Dispatch<React.SetStateAction<dataForGridRowType>>
  }

export function PruneAllButtonComponent({apiRef, CLI, setStorageSizeById, selectedGridRowStorageSize, setSelectedGridRowStorageSize, setDataForGridRows}:PruneAllButtonComponentProps) {
  // PROPS: apiRef={apiRef} CLI={ddClient} setStorageSizeById={setStorageSizeById} selectedGridRowStorageSize ={selectedGridRowStorageSize} setSelectedGridRowStorageSize={setSelectedGridRowStorageSize} setDataForGridRows={setDataForGridRows} 

    const [selectedTypes, SetSelectedTypes] = React.useState<{ [key: string]: boolean }>({
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
          
          let exitedContainerIdSet = new Set<string>();

          await CLI.docker.cli.exec('ps', ['--all', '--format', '"{{json .}}"', '--filter', "status=exited"])
           .then((result:any) => {
            // console.log('result exited containers', result)
            const exitedContainers:ContainerType[] = result.parseJsonLines()
            // console.log('result exited containers', exitedContainers)

            exitedContainers.forEach((container:ContainerType) => {
              exitedContainerIdSet.add(container.ID)
            })
          })

           //prune all exited containers
           await CLI.docker.cli.exec('rm', [...exitedContainerIdSet])
           .catch((err:any)=>{
            //COMMAND BELOW UPDATES THE SELECTED ROWS TO THOSE PASSED TO THE ROWIDS ARG. ANY ROW ALREADY SELECTED WILL BE UNSELECTED
            apiRef.current.setRowSelectionModel([])
            alert(`Error in container prune command ${err.stderr}`)});

          setStorageSizeById((storageSize:StorageSizeType) => ({
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
            

        }
        
        //************************************************************************************************************************

      if(key === 'dangling-images'){
        // console.log('Selected KEY', key)
        
        let danglingImageIdSet = new Set<string>();

        await GetAllStorage(CLI, 'data').
          then(res => {    
            res.data['dangling-images'].forEach((image:ImageType)=>{
              // console.log('images',image)
              danglingImageIdSet.add(image.ID)
            })
          })

         //prune all Dangling Images
         await CLI.docker.cli.exec('rmi', [...danglingImageIdSet])
         .catch((err:any)=>{
          //COMMAND BELOW UPDATES THE SELECTED ROWS TO THOSE PASSED TO THE ROWIDS ARG. ANY ROW ALREADY SELECTED WILL BE UNSELECTED
          apiRef.current.setRowSelectionModel([])
          console.log('Unable to prune... Dangling Image is being utilized by container',
           alert(`Error in container prune command ${err.stderr}`))
          });

        setStorageSizeById((storageSize:StorageSizeType) => ({
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
            
      }

      //************************************************************************************************************************

      if(key === 'unused-images'){
        // console.log('Selected KEY', key)
        
        let unusedImageIdSet = new Set<string>();

        await GetAllStorage(CLI, 'data').
          then(res => {    
            res.data['unused-images'].forEach((image:ImageType)=>{
              // console.log('images',image)
              unusedImageIdSet.add(image.ID)
            })
          })
    

         //prune all unused images
         await CLI.docker.cli.exec('rmi', [...unusedImageIdSet])
         .catch((err:any)=>{
          //COMMAND BELOW UPDATES THE SELECTED ROWS TO THOSE PASSED TO THE ROWIDS ARG. ANY ROW ALREADY SELECTED WILL BE UNSELECTED
          apiRef.current.setRowSelectionModel([])
          console.log('Unable to prune... Unused Image is being utilized by container',
          alert(`Error in unused image prune command ${err.stderr}`))});

        setStorageSizeById((storageSize:StorageSizeType) => ({
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
      }


      //************************************************************************************************************************

      }
    }

    //CLOSES MODEL
    setOpen(false);
    
   }

   //THESE WERE IMPORTED AND ARE UTILIZED AS MEDIA QUERIES
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


//POPOVER
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

  const handlePopoverClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const openPopover = Boolean(anchorEl);
  const id = openPopover ? 'simple-popover' : undefined;




    return (
      <>
      {matches === true ? //IF MATCHES IS EQUAL TO TRUE... MEANING IF THE WIDTH OF THE SCREEN HAS REACHED 875 PX
        <>
        <Button variant="contained" color='error' onClick={()=>{handleOpen()}} sx={{
                    m:2,
                    p: 1,
                    borderRadius: 2,
                    
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
 
                      <IconButton onClick={handlePopoverClick}><DeleteOutlineIcon color='error'/></IconButton> Build Cache - Beta
                          <Popover
                            
                            id={id}
                            open={openPopover}
                            anchorEl={anchorEl}
                            onClose={handlePopoverClose}
                            anchorOrigin={{
                              vertical: 'center',
                              horizontal: 'right',
                            }}
                            transformOrigin={{
                              vertical: 'center',
                              horizontal: 'left',
                            }}
                           
                           >
                          <Box sx={{display:'flex', flexDirection:'column', alignItems:'center'}}>
                         <TextField
                           id="outlined-read-only-input"
                           label="Run in Terminal"
                            defaultValue="Docker buildx prune -a"
                            InputProps={{
                            readOnly: true
                            }}
                            sx={{m:2, textAlign: 'center'}}
                          />
                          <Box sx={{ width: '250px', fontStyle: 'italic', m:2, color:'red'}}>Note: The Build Cache total storage value can be represented by multiple builder instances.
                          This pruning command will remove the cache within the default instance you are currently in, so if you notice that the "gold colored" value (in the build cache button group represented within the top left container) is not reducing in size that may mean that you have to change the builder instance you are in.
                          </Box>
                        </Box>
                        </Popover>
                       
                      

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

          : // ELSE - WE WANT TO UPDATE THE MARGIN BOTTOM TO BE 0

          <>
          <Button variant="contained" color='error' onClick={()=>{handleOpen()}} sx={{
                      m:2,
                      marginBottom:0,
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
                       <IconButton onClick={handlePopoverClick}><DeleteOutlineIcon color='error'/></IconButton> Build Cache - Beta
                          <Popover
                            
                            id={id}
                            open={openPopover}
                            anchorEl={anchorEl}
                            onClose={handlePopoverClose}
                            anchorOrigin={{
                              vertical: 'center',
                              horizontal: 'right',
                            }}
                            transformOrigin={{
                              vertical: 'center',
                              horizontal: 'left',
                            }}
                           
                           >
                         <Box sx={{display:'flex', flexDirection:'column', alignItems:'center'}}>
                         <TextField
                           id="outlined-read-only-input"
                           label="Run in Terminal"
                            defaultValue="Docker buildx prune -a"
                            InputProps={{
                            readOnly: true
                            }}
                            sx={{m:2, textAlign: 'center'}}
                          />
                          <Box sx={{ width: '250px', fontStyle: 'italic', m:2, color:'red'}}>Note: The Build Cache total storage value can be represented by multiple builder instances.
                          This pruning command will remove the cache within the default instance you are currently in, so if you notice that the "gold colored" value (in the build cache button group represented within the top left container) is not reducing in size that may mean that you have to change the builder instance you are in.
                          </Box>
                        </Box>
                        </Popover>
                       
                       
  
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
          }
        </>
    )
}


 