import {stringToNumConverter as strToNumb} from './StringToNumConverter'
import { totalStorageParser } from './totalStorageParser';
import { containerVirtualSizeConverterToString } from './ContainerVirtualSizeConverterToString';
import { checkBytesAndConvertToNumber } from './ CheckBytesAndConvertToNumber';
import { roundTwoDecimalPlaces } from './RoundTwoDecimalPlaces';

import { ImageType, ContainerType } from '../../types';

 async function AllImageAndContainerStorage(CLI:any){

    const storage = {
        'all-images': 0,
        'all-containers' : 0,
      };

    await CLI.docker.cli.exec('images', ['--format', '"{{json .}}"', '-a'])
    .then((result:any) => {
      // console.log('Dangling Result:', result)
      const allImgs:ImageType[] = result.parseJsonLines();
      // console.log('images',allImgs)
      storage['all-images'] = allImgs.reduce((sum:number,current:ImageType)=>{
        // console.log('current image in AllImageStorage module', current)
        return sum + strToNumb(current.Size);
      }, 0);
    })

    //EXITED CONTAINERS *******************************************************************************************************************
    await CLI.docker.cli.exec('ps', ['--all', '--format', '"{{json .}}"', '--filter', "status=exited"])
   .then((result:any) => {
    const unusedCont:ContainerType[] = result.parseJsonLines();
    // console.log('containers',unusedCont)

    //storage['unused-containers'] = 
    const containerSum:number =  unusedCont.reduce((sum:number,current:ContainerType)=>{ 
      const virtualStringConverter = containerVirtualSizeConverterToString(current.Size)
      //The checkBytesAndConvertToNumber function checks the type of Bytes (kb, mb, gb or byte) & converts to megabytes 
      //in the form of a number */
      // console.log('checkBytesAndConvertToNumber(virtualStringConverter) ', checkBytesAndConvertToNumber(virtualStringConverter) )
      return sum + checkBytesAndConvertToNumber(virtualStringConverter) 
    }, 0)

    // storage['unused-containers'] = containerSum;
    storage['all-containers'] += roundTwoDecimalPlaces(containerSum);
    // console.log("storage['unused-containers']", storage['unused-containers'])
    // console.log('roundThreeDecimalPlaces', roundTwoDecimalPlaces(containerSum))
  })


//For Paused Containers *******************************************************************************************************************

   //RUNNING CONTAINERS - also include paused containers so we want to create this set to conain all the paused container ids to 
  //be able to distinguish between paused and running containers. 
  const pausedContainerIdSet = new Set<string>(); 

  await CLI.docker.cli.exec('ps', ['--all', '--format', '"{{json .}}"', '--filter', "status=paused"])
  .then((result:any) => {
    const pausedCont:ContainerType[] = result.parseJsonLines();
    //storage['unused-containers'] = 
    const containerSum:number =  pausedCont.reduce((sum:number,current:ContainerType)=>{ 

      //add paused container ids to the set
      pausedContainerIdSet.add(current.ID)

      const virtualStringConverter = containerVirtualSizeConverterToString(current.Size)
      //The checkBytesAndConvertToNumber function checks the type of Bytes (kb, mb, gb or byte) & converts to megabytes 
      //in the form of a number */
      // console.log('checkBytesAndConvertToNumber(virtualStringConverter) ', checkBytesAndConvertToNumber(virtualStringConverter) )
      return sum + checkBytesAndConvertToNumber(virtualStringConverter) 
    }, 0)

    // storage['unused-containers'] = containerSum;
    storage['all-containers'] += roundTwoDecimalPlaces(containerSum);
    // console.log("storage['unused-containers']", storage['unused-containers'])
    // console.log('roundThreeDecimalPlaces', roundTwoDecimalPlaces(containerSum))
  })

  // console.log('paused container ids', pausedContainerIdSet)
  
//RUNNING CONTAINERS ***********************************************************************************************************************

await CLI.docker.cli.exec('ps', ['--format', '"{{json .}}"'])
.then((result:any) => {
  const runningCont:ContainerType[] = result.parseJsonLines();
  
  for(let container of runningCont){
    if(!pausedContainerIdSet.has(container.ID)){
      // console.log(container.Size);
      const virtualStringConverter = containerVirtualSizeConverterToString(container.Size);
      const sizeNum = checkBytesAndConvertToNumber(virtualStringConverter);
      // console.log('sizeNum', sizeNum)
      storage['all-containers'] += roundTwoDecimalPlaces(sizeNum);

    }
  }
})

    return storage
 }

 export default AllImageAndContainerStorage;