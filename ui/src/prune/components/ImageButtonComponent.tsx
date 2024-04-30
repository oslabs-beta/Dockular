import React, { useEffect } from 'react';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { storageNumToStr } from '../utilities/StorageNumtoStr';
 

export function ImageButtonComponent (props:any) {

     
        const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
        const open = Boolean(anchorEl);
        const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
          setAnchorEl(event.currentTarget);
        };
        const handleClose = () => {
            console.log('handleclose event', event)
          setAnchorEl(null);
        };
    
        function imageType(strType:string){
            // console.log(strType)
            if(strType === 'in-use-images'){
                props.type('in-use-images')

            } else if(strType === 'dangling-images') {
                props.type('dangling-images')

            } else if (strType === 'unused-images') {
                props.type('unused-images')
            }
        }
         
        function inUseImageNumToStr(numb:number){
  
            if(numb >= 1000) {
              return `${numb/1000}GB`
            } else if(numb < 1){
              return `${numb*1000}KB`
            } else {
              return `${numb}MB`
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
               Images
            </Button>

                <Button variant="contained" onClick={()=>{props.type('dangling-images')}} sx={{color: '#FFD700'}}>
                {Math.round(props.totalStorageTypes['all-images'])}
                {/* {storageNumToStr(props.totalStorageTypes['dangling-images'])} */}

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

            //  `Dangling Images (${storageNumToStr(props.totalStorageTypes['in-use-images'])})`
             >
            <MenuItem onClick={()=>{handleClose(), imageType('in-use-images')}}>{`In Use Images (${props.totalStorageTypes['in-use-images']})`}</MenuItem>
            <MenuItem onClick={()=>{handleClose(), imageType('dangling-images')}}> {`Dangling Images (${storageNumToStr(props.totalStorageTypes['dangling-images'])})`} </MenuItem>
            <MenuItem onClick={()=>{handleClose(), imageType('unused-images')}}>{`Unused Images (${props.totalStorageTypes['unused-images']})`}</MenuItem>
            
            </Menu>
            </>
    )
}