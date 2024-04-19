import {stringToNumConverter as strToNumb} from './utility/stringToNumConverter'

 async function GetAllStorage(CLI:any){
  const storage ={
    'dangling-images':0,
    'unused-containers':0
  };

  CLI.docker.cli.exec('images', ['--format', '"{{json .}}"', '--filter', "dangling=true"])
  .then((result:any) => {

    const danglingImg = result.parseJsonLines();
    console.log('result.parseJsonLines()', danglingImg)
    
    storage['dangling-images'] = danglingImg.reduce((sum:any,current:any)=>{
      return sum + strToNumb(current.Size);
    }, 0);
  })

  CLI.docker.cli.exec('ps', ['--all', '--format', '"{{json .}}"', '--filter', "status=exited"])
  .then((result:any) => {
    const unusedCont = result.parseJsonLines();
    console.log('unusedCont', unusedCont)
    storage['unused-containers'] = unusedCont.reduce((sum:any,current:any)=>{ 
      return sum+= strToNumb(current.Size);
    }, 0)
  })

  return storage;
}

export default GetAllStorage;