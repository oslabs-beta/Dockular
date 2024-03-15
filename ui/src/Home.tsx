import React, { useState, useEffect } from 'react';
import { Container, Box} from '@mui/material';
import myImage from './img/logo.png';

export function Home() {
    return(
        <Container sx={{ width: '90vw', height: '90vh'}}>
            <Box sx={{ maxWidth: '100%', height: 'auto'}}>
                <img src={myImage} style={{width:'100%', height:'auto'}} />
            </Box>
        </Container>
    )
}