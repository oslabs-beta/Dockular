import stringToNumConverter from './utility/stringToNumConverter'
export default function GetAllStorage(CLI){
  const storage ={
    'dangling-images':0,
    'unused-containers':0
  };

  ddClient.docker.cli.exec('images', ['--format', '"{{json .}}"', '--filter', "dangling=true"])
  .then((result) => {
    const danglingImg = result.parseJsonLines();
 
    storage['dangling-images'] = danglingImg.reduce((sum,current)=>{ 
      sum+= strToNumb(current.Size);
    }, 0)

  ddClient.docker.cli.exec('ps', ['--all', '--format', '"{{json .}}"', '--filter', "status=exited"])
  .then((result) => {
    const unusedCont = result.parseJsonLines();
    storage['unused-containers'] = unusedCont.reduce((sum,current)=>{ 
      sum+= strToNumb(current.Size);
    }, 0)
  })

  });

  return storage;
}