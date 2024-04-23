//UTILIZED BY: GetAllStorage component 

export function totalStorageParser(output:any) {

    const lines = output.split('\n');
    const entries = [];
  
    console.log("All Lines -> totalStorageParser: \n",lines)
    let totalLine:any= [];
    lines.forEach((ele:any)=>{
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