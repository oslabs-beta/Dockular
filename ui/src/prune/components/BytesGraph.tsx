
import {CircularProgressbarWithChildren, buildStyles} from 'react-circular-progressbar';
import { Box } from '@mui/system';

export function BytesGraph(props:any) {
    return (
        
        <CircularProgressbarWithChildren  value={props.value} maxValue={props.maxValue} text={props.comparison} strokeWidth={8} styles={buildStyles({
          strokeLinecap: "butt",
          textSize: '8px',
          pathColor: `${props.pathColor}`,
          })} >
        </CircularProgressbarWithChildren>
         

    )
}