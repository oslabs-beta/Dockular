//UTILIZED BY: GetAllStorage component 

export function totalStorageParser(output:string):number {

    const lines = output.split('\n');

    // console.log('output', output)
    // console.log('lines', lines)
    
    // console.log("All Lines -> totalStorageParser: \n",lines)
    let totalLine:string[]= [];
    
    lines.forEach((ele:string)=>{
      if(ele.match(/Total/g)){
        totalLine.push(ele)
      }
    })

    // const output1 = `5.949GB`;
    // console.log("Line with Total:\n",totalLine[0].slice(8, totalLine[0].length));
    //  console.log('test', output1.slice(0, output1.length).match(/GB/g));
    //  console.log('real', totalLine[0].slice(8, totalLine[0].length).match(/GB/g))
    //  console.log('test2', Number(output1.slice(0, output1.length-2)))
    //  console.log('real2', Number(totalLine[0].slice(8, totalLine[0].length-2)));
  
    const builtCascheisGB =  totalLine[0].slice(8, totalLine[0].length).match(/GB/g);
    const convertBuiltCascheToNumber = Number(totalLine[0].slice(8, totalLine[0].length-2));

    // console.log('builtCascheisGB', builtCascheisGB)
    // console.log('convertBuiltCascheToNumber', convertBuiltCascheToNumber)
  
    if(builtCascheisGB) {
      return convertBuiltCascheToNumber * 1000;
    } else {
      return convertBuiltCascheToNumber;
    }
  }