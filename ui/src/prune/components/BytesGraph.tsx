
import {CircularProgressbarWithChildren, buildStyles} from 'react-circular-progressbar';
 
type BytesGraphProps = {
  comparison: string;
  value: number;
  maxValue: number;
  pathColor: string;
}

export function BytesGraph({comparison, value, maxValue, pathColor}:BytesGraphProps) {
  
    return (
      
        <CircularProgressbarWithChildren  value={value} maxValue={maxValue} text={comparison} strokeWidth={8} styles={buildStyles({
          strokeLinecap: "butt",
          textSize: '8px',
          pathColor: `${pathColor}`,
          })} >
        </CircularProgressbarWithChildren>
        

    )
}