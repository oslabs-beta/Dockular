//UTILIZED BY: GetAllStorage component 

export function totalStorageParser(output:string):number {

    const lines = output.split('\n');

    // console.log("All Lines -> totalStorageParser: \n",lines)
    let totalLine:string[]= [];
    
    lines.forEach((ele:string)=>{
      if(ele.match(/Total/g)){
        totalLine.push(ele)
      }
    })

    // console.log("Line with Total:\n",totalLine[0].slice(8, totalLine[0].length));
  
    const builtCascheisGB =  totalLine[0].slice(8, totalLine[0].length).match(/GB/g);
    const convertBuiltCascheToNumber = Number(totalLine[0].slice(8, totalLine[0].length-2));
  
    if(builtCascheisGB) {
      return convertBuiltCascheToNumber  * 1000;
    } else {
      return convertBuiltCascheToNumber;
    }
  }