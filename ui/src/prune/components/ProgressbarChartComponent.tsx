
import {CircularProgressbarWithChildren, buildStyles} from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { storageNumToStr } from '../utilities/StorageNumtoStr';
import { BytesGraph } from './BytesGraph';
import { Box} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useEffect } from 'react';

type ProgressbarChartComponentProps = {
  selectedTotal: number,
  combinedTotal: number
}

export function ProgressbarChartComponent({selectedTotal, combinedTotal}:ProgressbarChartComponentProps ) {

    const val:string = `${storageNumToStr(selectedTotal)} / ${storageNumToStr(combinedTotal)}`
    
    // const mediaQueryForMaxHeight = window.matchMedia("(max-height: 695px)");
    // useEffect(()=>{
    //   console.log('mediaQueryForMaxHeight',mediaQueryForMaxHeight.matches)
    // })

    const Root = styled('div')(({ theme }) => ({
      [theme.breakpoints.up('sm')]: {
        maxWidth: '425px', 
        maxHeight: '425px',
      },
      [theme.breakpoints.up('md')]: {
        maxWidth: '525px', 
        maxHeight: '525px',
      },
      [theme.breakpoints.up('lg')]: {
        maxWidth: '550px', 
        maxHeight: '600px',
      }
    }));
    
    function byteGraph(){
      //kilobytes
      if(selectedTotal < 1){
        const comparison:string = `${storageNumToStr(selectedTotal)} / ${'1MB'}`
        const value:number = selectedTotal;
        const maxValue:number = 1;
        const pathColor:string = "#D61A3C"
        return <BytesGraph comparison={comparison} value={value} maxValue={maxValue} pathColor ={pathColor}/>
      //megabytes
      } else if(selectedTotal > 1 && selectedTotal < 1000) {
        const comparison:string = `${storageNumToStr(selectedTotal)} / ${'1GB'}`
        const value:number = selectedTotal;
        const maxValue:number = 1000;
        const pathColor:string = "#E27429"
        return <BytesGraph comparison={comparison} value={value} maxValue={maxValue} pathColor ={pathColor}/>
      //gigabytes
      } else {
        const comparison:string = `${storageNumToStr(selectedTotal)} / ${'1TB'}`
        const value:number = selectedTotal;
        const maxValue:number = 1000;
        const pathColor:string = "#68cd75"
        return <BytesGraph comparison={comparison} value={value} maxValue={maxValue} pathColor ={pathColor}/> 
      }
    }

   
    return (
      
      <Root>
        <Box sx={{ 
        width:'95%', 
        height:'95%',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        // border: 2,
        // borderColor: 'red'
        }}>

        
          <Box sx={{ 
            marginRight: '20px',
            marginLeft: 2
          }}>
          
           <CircularProgressbarWithChildren value={selectedTotal} maxValue={combinedTotal} text={val} strokeWidth={8} styles={buildStyles({
             strokeLinecap: "butt",
             textSize: '8px',
            })} >
           </CircularProgressbarWithChildren>
          </Box>
           
          <Box> 
            {byteGraph()}
          </Box>
      </Box>
      </Root>
    )
}

