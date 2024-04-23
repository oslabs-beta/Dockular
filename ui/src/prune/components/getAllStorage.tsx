import {stringToNumConverter as strToNumb} from '../utility/stringToNumConverter'
import { totalStorageParser } from '../utility/totalStorageParser';

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
  
  // CLI.docker.cli.exec('ps', ['--all', '--format', '"{{json .}}"', '--filter', "status=exited"])
  // .then((result:any) => {
  //   const unusedCont = result.parseJsonLines();
  //   console.log('unusedCont', unusedCont)
  //   storage['unused-containers'] = unusedCont.reduce((sum:any,current:any)=>{ 
  //     return sum+= strToNumb(current.Size);
  //   }, 0)
  // })

  storage['combinedTotal'] = storage['dangling-images'] + storage['unused-containers'] + storage['built-casche']

  return storage;
}

export default GetAllStorage;

