
 async function GetRunningContainers(CLI:any){
 

 
  const runningContainerDataArray:any = [];

 //running containers also include paused containers so we want to create this set to conain all the paused container ids to 
  //be able to distinguish between paused and running containers. 
  const pausedContainerIdSet = new Set(); 
 

  //For Paused Containers *******************************************************************************************************************


  await CLI.docker.cli.exec('ps', ['--all', '--format', '"{{json .}}"', '--filter', "status=paused"])
  .then((result:any) => {
    const pausedCont = result.parseJsonLines();

    pausedCont.forEach((container:any) =>{
      //add paused container ids to the set
      pausedContainerIdSet.add(container.ID)
    })
    
  })

  // console.log('paused container ids', pausedContainerIdSet)
  
//RUNNING CONTAINERS ***********************************************************************************************************************

  await CLI.docker.cli.exec('ps', ['--format', '"{{json .}}"'])
  .then((result:any) => {
    const pausedCont = result.parseJsonLines();
    //storage['unused-containers'] = 
    pausedCont.forEach((container:any) =>{
    if(!pausedContainerIdSet.has(container.ID)) {
      console.log('running container', container)
        runningContainerDataArray.push({
            ID: container.ID, 
            Size: container.Size,
            RunningFor: container.RunningFor, 
            State: container.State,
            Names: container.Names,
            Image: container.Image
          })
      }
    }, 0) 
  })


  return runningContainerDataArray;
}

export default GetRunningContainers;

