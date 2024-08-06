//UTILIZED BY: first useEffect in prune file



export function BuiltCascheRowDataParser(output:string) {
  
  const lines = output.split('\n');
  const entriesFiltered: string[][] = []; //array of arrays
  const parsedBuiltCascheArray: Array<{[key:string]: string}> = []; //[{id: 'id', size: 'size', CreatedSince: '', reclaimable: false}]

  // console.log("All Lines: \n",lines)

  let totalLine:string[]= [];

  /*we want to exclude the last element of the lines array because it contains information we are not utilizing.
  it also contains the key reclaimable with a different value then we expect causing an issue with the slice
  method in the bottom of the page*/

  for(let i = 0; i < lines.length-1; i++){
    const ele = lines[i];
    // console.log('ele', ele, typeof ele)
    /*each built-casche is seperated by an empty string due to the --verbose flag... 
    (Uncomment console.log("All Lines: \n",lines) on line 11 for representation)
    so everytime we get an empty string we know to push the totalLine array into the entriesFiltered array. 
    Each totalLine array pushed into the entriesFiltered array will contain the information of each built-casche. 
    */
      if(ele.length !== 0){
        totalLine.push(ele);
      } else{
        /*else we are still iterating through the elements of the totalLine array representing the current built casche. 
        So we filter through the totalLine array to make sure we only get the elements that we want. 
        Each element within the totalLine is a string. */
        const filteredElementsInTotalLine:Array<string> = totalLine.filter((el:string)=> el.match(/ID/g) || el.match(/Size/g) || el.match(/Last/g) || el.match(/Reclaimable/g))
        
        // console.log('filteredElementsInTotalLine', filteredElementsInTotalLine)

        //we want to make sure that the storage size of each built-casche is in MB. Without this algo below
        //we will have sizes of bytes, kilobytes as well.. 
        filteredElementsInTotalLine.forEach((element:string)=>{
          if(element.match(/MB/g)) {
            // console.log('element in filteredElementsInTotalLine -->', filteredElementsInTotalLine) 
            // console.log('totalLine', totalLine)
            // console.log('totalLine.filter((el:any)=> el.match(/ID/g) || el.match(/Size/g) || el.match(/Last/g) || el.match(/Reclaimable/g)', totalLine.filter((el:any)=> el.match(/ID/g) || el.match(/Size/g) || el.match(/Last/g) || el.match(/Reclaimable/g)))
            entriesFiltered.push(totalLine.filter((el:string)=> el.match(/ID/g) || el.match(/Size/g) || el.match(/Last/g) || el.match(/Reclaimable/g)));
          }
        })
        //we reset the totalLine into an empty array so we can fill it again prior to pushing into enteriesFiltered.
        totalLine = [];
    }
  }

  /*entriesFiltered is an array of arrays. Each element (array) represents each built-casche we want to pull the data from.
  We utilize the forEach method and the logic below to convert each array into an object with the data we need to represent
  within the dataGrid Rows. 
  */

  // console.log('entriesFiltered', entriesFiltered)
  entriesFiltered.forEach((element: Array<string>)=> {
    type ParsedObjType = {ID:string, Size:string, CreatedSince:string, Reclaimable:string};
    const parsedObj: ParsedObjType = {ID: 'id', Size: 'size', CreatedSince: '', Reclaimable: 'False'};

     parsedObj.ID = element[0].slice(5, element[0].length);
     parsedObj.Size = element[2].slice(7, element[2].length);
     parsedObj.CreatedSince = element[3].slice(11, element[3].length);
     parsedObj.Reclaimable = element[1].slice(13, element[1].length);
     

     parsedBuiltCascheArray.push(parsedObj);
  })

  // console.log('parsedBuiltCascheArray from BuiltCascheRowDataParser', parsedBuiltCascheArray)
  return JSON.stringify(parsedBuiltCascheArray);
 
}