
import {CircularProgressbarWithChildren, buildStyles} from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { storageNumToStr } from '../utilities/StorageNumtoStr';
import { BytesGraph } from './BytesGraph';
import { Box} from '@mui/material';

export function ProgressbarChartComponent(props:any) {

    const val:any = `${storageNumToStr(props.selectedTotal)} / ${storageNumToStr(props.combinedTotal)}`
    
    function byteGraph(){
      //kilobytes
      if(props.selectedTotal < 1){
        const comparison :any = `${storageNumToStr(props.selectedTotal)} / ${'1MB'}`
        const value = props.selectedTotal;
        const maxValue = 1;
        const pathColor = "#D61A3C"
        return <BytesGraph comparison={comparison} value={value} maxValue={maxValue} pathColor ={pathColor}/>
      //megabytes
      } else if(props.selectedTotal > 1 && props.selectedTotal < 1000) {
        const comparison:any = `${storageNumToStr(props.selectedTotal)} / ${'1GB'}`
        const value = props.selectedTotal;
        const maxValue = 1000;
        const pathColor = "#E27429"
        return <BytesGraph comparison={comparison} value={value} maxValue={maxValue} pathColor ={pathColor}/>
      //gigabytes
      } else {
        const comparison:any = `${storageNumToStr(props.selectedTotal)} / ${'1TB'}`
        const value = props.selectedTotal;
        const maxValue = 1000;
        const pathColor = "#68cd75"
        return <BytesGraph comparison={comparison} value={value} maxValue={maxValue} pathColor ={pathColor}/>
      }
    }
    
    return (
        <Box sx={{ 
        width:'95%', 
        height:'95%',
        // border:2,
        // borderColor:'primary.main',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
         
        }}>

        <Box sx={{ 
        width:'260px', 
        height:'260px',
        // border:2,
        // borderColor:'red',
        marginRight: '20px',
     
        }}>

        <CircularProgressbarWithChildren value={props.selectedTotal} maxValue={props.combinedTotal} text={val} strokeWidth={8} styles={buildStyles({
          strokeLinecap: "butt",
          textSize: '8px',
        })} >
        </CircularProgressbarWithChildren>
        </Box>

        <Box sx={{ 
        width:'260px', 
        height:'260px',
        
        // border:2,
        // borderColor:'red',
        }}>
        {byteGraph()}
          </Box>

        </Box>
    )
}

