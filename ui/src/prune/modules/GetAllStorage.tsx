import {stringToNumConverter as strToNumb} from '../utilities/StringToNumConverter'
import { totalStorageParser } from './totalStorageParser';
import { containerVirtualSizeConverterToString } from './ContainerVirtualSizeConverterToString';
import { checkBytesAndConvertToNumber } from './ CheckBytesAndConvertToNumber';
import { roundThreeDecimalPlaces } from '../utilities/RoundThreeDecimalPlaces';


 async function GetAllStorage(CLI:any){
  const storage = {
    'dangling-images': 0,
    'unused-containers': 0,
    'built-casche': 0,
    'combinedTotal' : 0
  };

  //For Dangling Images
  await CLI.docker.cli.exec('images', ['--format', '"{{json .}}"', '--filter', "dangling=true"])
  .then((result:any) => {
    // console.log('Dangling Result:', result)
    const danglingImg = result.parseJsonLines();
    storage['dangling-images'] = danglingImg.reduce((sum:any,current:any)=>{
      return sum + strToNumb(current.Size);
    }, 0);
  })

  //For Built Casche
  await CLI.docker.cli.exec('builder', ['du', '--verbose'])
  .then((results:any) => {
    // console.log('build casche', results.parseJsonLines())
    // console.log('parseDockerBuilderDUOutput(results) -->', parseDockerBuilderDUOutput(results.stdout))
    storage['built-casche'] = totalStorageParser(results.stdout)
  })
  

  //For Unused Containers
  await CLI.docker.cli.exec('ps', ['--all', '--format', '"{{json .}}"', '--filter', "status=exited", '--filter', "status=paused", '--filter', "status=created"])
  .then((result:any) => {
    const unusedCont = result.parseJsonLines();
    //storage['unused-containers'] = 
    const containerSum =  unusedCont.reduce((sum:any,current:any)=>{ 
      const virtualStringConverter = containerVirtualSizeConverterToString(current.Size)
      //The checkBytesAndConvertToNumber function checks the type of Bytes (kb, mb, gb or byte) & converts to megabytes 
      //in the form of a number */
      console.log('checkBytesAndConvertToNumber(virtualStringConverter) ', checkBytesAndConvertToNumber(virtualStringConverter) )
      return sum + checkBytesAndConvertToNumber(virtualStringConverter) 
    }, 0)

    // storage['unused-containers'] = containerSum;
    storage['unused-containers'] = roundThreeDecimalPlaces(containerSum);
    // console.log("storage['unused-containers']", storage['unused-containers'])
    // console.log('roundThreeDecimalPlaces', roundTwoDecimalPlaces(containerSum))
  })

  // console.log("storage['unused-containers']", storage['unused-containers'])

  storage['combinedTotal'] = storage['dangling-images'] + storage['unused-containers'] + storage['built-casche']

  return storage;
}

export default GetAllStorage;

