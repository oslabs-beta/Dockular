
import {CircularProgressbarWithChildren, buildStyles} from 'react-circular-progressbar';
 

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