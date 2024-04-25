import React from 'react';

import { CircularProgressbar, CircularProgressbarWithChildren, buildStyles} from 'react-circular-progressbar';
import RadialSeparators from './RadialSeparators';
import 'react-circular-progressbar/dist/styles.css';
import { storageNumToStr } from '../utilities/StorageNumtoStr';

export function ProgressbarChartComponent(props:any) {
    console.log(props.selectedTotal, props.combinedTotal)
    const val:any = `${storageNumToStr(props.selectedTotal)} / ${storageNumToStr(props.combinedTotal)}`
    // style={{ width: 200, height: 200 }}
    return (
        
        <div style={{ width: 260, height: 260 }}>
            
        <CircularProgressbarWithChildren value={props.selectedTotal} maxValue={props.combinedTotal} text={val} strokeWidth={10} styles={buildStyles({
          strokeLinecap: "butt",
          textSize: '9px',
              // Colors
            // pathColor: `rgba(62, 152, 199, ${percentage / 100})`,
            // textColor: '#f88',
            // trailColor: '#d6d6d6',
            // backgroundColor: '#3e98c7',
            
        })} 
        >
         <RadialSeparators
          count={12}
          style={{
            background: "#fff",
            width: "2px",
            // This needs to be equal to props.strokeWidth
            height: `${10}%`
          }}
        />
        
    </CircularProgressbarWithChildren>

        </div>

    )
}