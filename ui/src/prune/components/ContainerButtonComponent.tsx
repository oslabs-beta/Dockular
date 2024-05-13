import React, { useEffect } from 'react';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { storageNumToStr } from '../utilities/StorageNumtoStr';




 

export function ContainerButtonComponent (props:any) {
 
        const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
        const open = Boolean(anchorEl);
        const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
          setAnchorEl(event.currentTarget);
        };
        const handleClose = () => {
            console.log('handleclose event', event)
          setAnchorEl(null);
        };
    
        function containerType(strType:string){
            // console.log(strType)
            if(strType === 'exited-containers'){ //EXITED CONTAINERS
                props.setDataGridBlueButtonType('exited-containers')

            } else if(strType === 'paused-containers') {
                props.setDataGridBlueButtonType('paused-containers')

            } else if (strType === 'running-containers') {
                props.setDataGridBlueButtonType('running-containers')
            }
        }
       

    return (
        <>
        <ButtonGroup variant="contained" aria-label="Basic button group" sx={{m:2}}>
            <Button 
            variant="contained" 
            // onClick={()=>{props.type('dangling-images')}} 
            aria-controls={open ? 'basic-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            onClick={handleClick}
            >
              Containers
            </Button>

                <Button variant="contained" sx={{color: '#FFD700', marginRight: 2}}>
                { storageNumToStr(props.allImageAndContainerStorage['all-containers'])}
                </Button>
               
                
            </ButtonGroup>
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                'aria-labelledby': 'basic-button',
             }}

            
             >
            <MenuItem onClick={()=>{handleClose(), containerType('running-containers')}}> {`Running Containers (${storageNumToStr(props.totalStorageTypes['running-containers'])})`} </MenuItem>
            <MenuItem onClick={()=>{handleClose(), containerType('paused-containers')}}> {`Paused Containers (${storageNumToStr(props.totalStorageTypes['paused-containers'])})`} </MenuItem>
            <MenuItem onClick={()=>{handleClose(), containerType('exited-containers')}}>{`Exited Containers (${storageNumToStr(props.totalStorageTypes['exited-containers'])})`}</MenuItem>
            </Menu>
           
            </>
    )
}