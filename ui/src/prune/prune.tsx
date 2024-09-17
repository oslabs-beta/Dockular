import { Box, Container } from '@mui/material';
import { blueGrey } from '@mui/material/colors';
import useMediaQuery from '@mui/material/useMediaQuery';
import { createTheme } from '@mui/material';

//mui grid
import { useGridApiRef } from '@mui/x-data-grid';

//components
import { BottomLeftComponent } from './components/MainFourComponents/BottomLeftComponent';
import { BottomRightComponent } from './components/MainFourComponents/BottomRightComponent';
import { TopLeftComponent } from './components/MainFourComponents/TopLeftComponent';
import { TopRightComponent } from './components/MainFourComponents/TopRightComponent';
 
 
export function Prune() {
 
//state for dataGrid
const apiRef = useGridApiRef();
 
//THESE WERE IMPORTED AND ARE UTILIZED AS MEDIA QUERIES
//  const theme = useTheme();
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
        <Container sx={{
                width: matches === true ? '95vw' : '90vw',
                height: '85vh',
                bgcolor: blueGrey[50],
                display: 'flex',
                flexDirection: 'column',
                border:2,
                borderColor:'primary.main'
            }}>
          <Box sx={{
            width: matches === true ? '90vw' : '85vw',
            height: '40vh',
            bgcolor: blueGrey[50],
            display: 'flex',
            justifyContent:'space-around',
            marginTop:4

            }}>
              <TopLeftComponent matches={matches}/>
              <TopRightComponent apiRef={apiRef}/>
          </Box>

          <Box sx={{
            width: matches === true ? '90vw' : '85vw',
            height: matches === true ? '40vh' : '38vh',
            bgcolor: blueGrey[50],
            display: 'flex',
            justifyContent:'space-around',
             }}>
              <BottomLeftComponent matches={matches} apiRef={apiRef}> </BottomLeftComponent>
              <BottomRightComponent/>
          </Box>

        </Container>
    </>
  );
} 


