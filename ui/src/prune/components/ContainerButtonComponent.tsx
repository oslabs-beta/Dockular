import React, { useEffect } from 'react';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { storageNumToStr } from '../utilities/StorageNumtoStr';
import useMediaQuery from '@mui/material/useMediaQuery';
import { createTheme } from '@mui/material';

type PropsType = {
    setDataGridBlueButtonType: React.Dispatch<React.SetStateAction<string>>;
    allImageAndContainerStorage: {[key:string]: number}; 
    totalStorageTypes: {[key:string]: number}; 
};

export function ContainerButtonComponent ({setDataGridBlueButtonType, allImageAndContainerStorage, totalStorageTypes} : PropsType) {
 
        const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
        const open = Boolean(anchorEl);
        const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
          setAnchorEl(event.currentTarget);
        };
        
        const handleClose = () => {
            // console.log('handleclose event', event)
          setAnchorEl(null);
        };
    
        function containerType(strType:string){
            // console.log(strType)
            if(strType === 'exited-containers'){ //EXITED CONTAINERS
                setDataGridBlueButtonType('exited-containers')

            } else if(strType === 'paused-containers') {
                setDataGridBlueButtonType('paused-containers')

            } else if (strType === 'running-containers') {
                setDataGridBlueButtonType('running-containers')
            }
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
   

    return (
        <>
        { matches === true ? 
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
                    { storageNumToStr(allImageAndContainerStorage['all-containers'])}
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
                <MenuItem onClick={()=>{handleClose(), containerType('running-containers')}}> {`Running Containers (${storageNumToStr(totalStorageTypes['running-containers'])})`} </MenuItem>
                <MenuItem onClick={()=>{handleClose(), containerType('paused-containers')}}> {`Paused Containers (${storageNumToStr(totalStorageTypes['paused-containers'])})`} </MenuItem>
                <MenuItem onClick={()=>{handleClose(), containerType('exited-containers')}}>{`Exited Containers (${storageNumToStr(totalStorageTypes['exited-containers'])})`}</MenuItem>
                </Menu>
        </>
        : 
        <>
         <Button 
            variant="contained" 
            // onClick={()=>{props.type('dangling-images')}} 
            aria-controls={open ? 'basic-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            onClick={handleClick}
            sx={{m:2, marginBottom:0}}
            >
            Containers
            </Button>
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                'aria-labelledby': 'basic-button',
            }}
            >
            <MenuItem onClick={()=>{handleClose(), containerType('running-containers')}}> {`Running Containers (${storageNumToStr(totalStorageTypes['running-containers'])})`} </MenuItem>
            <MenuItem onClick={()=>{handleClose(), containerType('paused-containers')}}> {`Paused Containers (${storageNumToStr(totalStorageTypes['paused-containers'])})`} </MenuItem>
            <MenuItem onClick={()=>{handleClose(), containerType('exited-containers')}}>{`Exited Containers (${storageNumToStr(totalStorageTypes['exited-containers'])})`}</MenuItem>
            </Menu>
        </>
        
        }
           
        </>
    )
}