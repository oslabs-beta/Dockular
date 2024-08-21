import React, { useEffect } from 'react';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { storageNumToStr } from '../utilities/StorageNumtoStr';
import useMediaQuery from '@mui/material/useMediaQuery';
import { createTheme } from '@mui/material';

import { AllImageAndContainerStorageType, TotalStorageType }  from '../../types';

interface ImageButtonComponentProps {
    setDataGridBlueButtonType : React.Dispatch<React.SetStateAction<string>>,
    allImageAndContainerStorage: AllImageAndContainerStorageType,
    totalStorageTypes: TotalStorageType
}
 

export function ImageButtonComponent ({setDataGridBlueButtonType, allImageAndContainerStorage, totalStorageTypes } : ImageButtonComponentProps) {
 
        const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
        const open = Boolean(anchorEl);
        const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
          setAnchorEl(event.currentTarget);
        };
        const handleClose = () => {
            // console.log('handleclose event', event)
          setAnchorEl(null);
        };
    
        function imageType(strType:string){
            // console.log(strType)
            if(strType === 'in-use-images'){
                setDataGridBlueButtonType('in-use-images')

            } else if(strType === 'dangling-images') {
                setDataGridBlueButtonType('dangling-images')

            } else if (strType === 'unused-images') {
                setDataGridBlueButtonType('unused-images')
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
               Images
            </Button>

                <Button variant="contained" sx={{color: '#FFD700', marginRight: 2}}>
                { storageNumToStr(allImageAndContainerStorage['all-images'])}
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
            <MenuItem onClick={()=>{handleClose(), imageType('in-use-images')}}>{`In Use Images (${storageNumToStr(totalStorageTypes['in-use-images'])})`}</MenuItem>
            <MenuItem onClick={()=>{handleClose(), imageType('dangling-images')}}> {`Dangling Images (${storageNumToStr(totalStorageTypes['dangling-images'])})`} </MenuItem>
            <MenuItem onClick={()=>{handleClose(), imageType('unused-images')}}>{`Unused Images (${storageNumToStr(totalStorageTypes['unused-images'])})`}</MenuItem>
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
               Images
            </Button>

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
            <MenuItem onClick={()=>{handleClose(), imageType('in-use-images')}}>{`In Use Images (${storageNumToStr(totalStorageTypes['in-use-images'])})`}</MenuItem>
            <MenuItem onClick={()=>{handleClose(), imageType('dangling-images')}}> {`Dangling Images (${storageNumToStr(totalStorageTypes['dangling-images'])})`} </MenuItem>
            <MenuItem onClick={()=>{handleClose(), imageType('unused-images')}}>{`Unused Images (${storageNumToStr(totalStorageTypes['unused-images'])})`}</MenuItem>
            </Menu>
           
            </>
        }       
            </>
    )
}