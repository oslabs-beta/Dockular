import {stringToNumConverter as strToNumb} from '../StringToNumConverter'
import { totalStorageParser } from '../Parsers/totalStorageParser';
import { containerVirtualSizeConverterToString } from '../ContainerVirtualSizeConverterToString';
import { checkBytesAndConvertToNumber } from '../ CheckBytesAndConvertToNumber';
import { roundTwoDecimalPlaces } from '../RoundTwoDecimalPlaces';

import { ImageType, TotalStorageType, ContainerType} from '../../../types';

 async function getStorage(CLI:any): Promise<TotalStorageType>{
  const storage = {
      'running-containers': 0,
      'exited-containers': 0, //EXITED
      'paused-containers':0,
      'dangling-images': 0,
      'in-use-images': 0,
      'unused-images':0,
      'built-casche': 0,
      'combinedTotal': 0
  };

  const allImagesObj : {[key:string]:ImageType} = {}; 
  //we want to keep a track of all the repositorys that are not equal to <none>. This assists us in parsing out which images are in use. 
   
  //Obj that manages all Images with Repository and Tag
  const allImageRepositoryAndTagObj: {[key:string]:{[key:string]:string}} = {}
   //we want to keep a track of all the repositorys that are not equal to <none>. This assists us in parsing out which images are in use. 
  const allImageRepositoriesOnlyObj: {[key:string]:{[key:string]:string}} = {}; // {Repository:{ID, Size}}

  const allUnusedImagesSet = new Set<string>(); 

  const allData:{storage: TotalStorageType; data: {[key:string]:ImageType[]}} = {storage: storage, data: {
    'running-containers': [], 
    'exited-containers': [], 
    'paused-containers': [], 
    'in-use-images': [],
    'dangling-images': [], 
    'unused-images':  [], 
    'built-casche': [],
   }
  }

 

  //ALL IMAGES*******************************************************************************************************************************************************************************
  await CLI.docker.cli.exec('images', ['--format', '"{{json .}}"', '-a'])
  .then((result:any) => {
    // console.log('Dangling Result:', result)
    const AllImgs:ImageType[] = result.parseJsonLines();
    AllImgs.forEach((el) => {
       

      //we only want to add to the allImageRepositoriesObj if the image repository within all the images has a repository ..we dont want the ones with <none> or any tag
      if(!el.Repository.match('<none>'))  {
        //tracks keys with repository and tag
        allImageRepositoryAndTagObj[`${el.Repository}:${el.Tag}`] = {ID: el.ID, Size: el.Size, Repository: el.Repository, Tag: el.Tag, RepTag: `${el.Repository}:${el.Tag}`}
        //tracks keys with just repository only
        allImageRepositoriesOnlyObj[el.Repository] = {ID: el.ID, Size: el.Size, Repository: el.Repository, Tag: el.Tag, RepTag: `${el.Repository}:${el.Tag}`}
      }
      
      //we need to have a list of all available images seperately to utlize in the code below when finding in use or dangling images. 
      allImagesObj[el.ID] = {ID: el.ID, Size: el.Size, Repository: el.Repository, Tag: el.Tag, CreatedSince: el.CreatedSince}
      allUnusedImagesSet.add(el.ID)
    })
  })

  //IN USE IMAGES*******************************************************************************************************************************************************************************
   
   
    //Set that contains allImagesUsedByConainer Ids
  const idsForallImagesUsedByContainerSet= new Set<string>();
  
   await CLI.docker.cli.exec('ps', ['--format', '"{{json .}}"', '-a'])
   .then((result:any) => {
 
     const allImagesUsedByContainer:ContainerType[] = result.parseJsonLines();


    //4Test Cases
    //1. someone creates with latest tag ex: <postgres:latest>
    //2. someone creates  without tag  ex: <postgres> (IT APPEARS THAT WHEN YOU RUN THE ALL IMAGES COMMAND IT WILL ALWAYS COMES WITH A TAG IF THE USER INPUTTED A REPOSITORY)
    //3. someone creates with a tag different than latest ex: <postgres:alpine3.19>
    //4. someone creates with container id <f10065888d06>
    /*5. What if we create a container utilizing only the repository Postgres without a Tag.. the image will automatically include a tag:latest within allImageRepositoryAndTagObj.
         With that in mind if we have an image that is not being utilized by a container for example <postgres:alpine3.19> our algorithm might grab the wrong id because it will 
         be included within the all images category (as an unused image).... if you want to create this test case ... create an image with  <postgres:alpine3.19> and 
         delete its container*/
   
        

     //if index returns with -1 that could mean that either its a repostiory without a tag or an id.       
     allImagesUsedByContainer.forEach((el) => {
      const index = el.Image.indexOf(':')
      if(index !== -1){
       
        //user creates container with Repository:Tag - Tag could be latest or a random one like <postgres:alpine3.19> (#1 & 3)
        if(el.Image === allImageRepositoryAndTagObj[el.Image].RepTag){  
          //Remember The keys to the allImageRepositoryAndTagObj are key ex: key: postgres:alpine3.19 value: {ID, SIZE, Repository, etc...}
          idsForallImagesUsedByContainerSet.add(allImageRepositoryAndTagObj[el.Image].ID)
          
        }
        
      // If it falls under the else that means its an image that was created without a tag or created with an id
      } else {

          /*edge case to check if it the image has a Repository... we had two choices here either create a seperate object that just 
          tracks the keys or utilize the splice method on the keys of allImageRepositoryAndTagObj which were both Repo:Tag. Remember the Images
          within this else statement are the ones that created containers with only a REPO (NO TAG)*/
          
          if(allImageRepositoriesOnlyObj[el.Image]){
            // console.log('REPO ONLY MATCHES: allImageRepositoriesOnlyObj[el.Image])', el.Image)

                  /*Containers that are created with an image Repo will automatically produce a tag of latest which is why we can make that assumption in the code below*/

                   /*Edge case for (#5).. we dont want to accidentally get the wrong id. If we created a container with just the repository <postrgres> we
                   want to add the string latest to it so it gets the write image id and not accidentally the image id for an image not being used by a 
                   container but has a similar repository but different tag. Ex: <postgres:alpine3.19>*/
                   
                   if(`${el.Image}:latest` === allImageRepositoryAndTagObj[`${el.Image}:latest`].RepTag){
                  //  console.log(`${allImageRepositoryAndTagObj[el.Image].Repository}:${allImageRepositoryAndTagObj[el.Image].Tag}`)
                   idsForallImagesUsedByContainerSet.add(allImageRepositoryAndTagObj[`${el.Image}:latest`].ID);
                    // console.log('allImageRepositoriesOnlyObj[el.Image].RepTag',allImageRepositoryAndTagObj[el.Image].RepTag)
                  } 
                  
                  /*The allImageRepositoriesOnlyObj for some reason does not seperate postgress:latest from postress:alpine3.19... due to the fact that 
                    we are only assigning the Repo as the key whats happens is that it just replaces the tag, id, size etc... when it saves the key of postgres
                    from postgress:latest to postress:alpine3.19.. That is why its so crucial that we utilize allImageRepositoryAndTagObj with keys that are 
                    a combination of repo and tag ... it forces the algorithm to seperate the two images rather than update the values ... Remember objects are 
                    passed by reference */

               
          } else {
           
            // if no tag then it must be an id (#4)  
               idsForallImagesUsedByContainerSet.add(el.Image);
          }
        }
     })

     idsForallImagesUsedByContainerSet.forEach((id:any)=>{
      //if the allUnusedImagesSet (which tracks in the begining all ids) contains an id from the idsForallImagesUsedByContainerSet we want to remove
      //that id with the goal of only having a set of ids for unused images. 
      if(allUnusedImagesSet.has(id)) allUnusedImagesSet.delete(id);
      // console.log('idsForallImagesUsedByContainerSet',allImagesObj[id])
        // storage['in-use-images'] += strToNumb(allImagesObj[id].Size)
        storage['in-use-images'] += checkBytesAndConvertToNumber(allImagesObj[id].Size)
        // allData.data['in-use-images'].push({
        //   ID: allImagesObj[id].ID, 
        //   Size: allImagesObj[id].Size, 
        //   CreatedSince: allImagesObj[id].CreatedSince, 
        //   Tag: allImagesObj[id].Tag,
        //   Type: 'Image'
        // })
     })
   })






  //For Dangling Images *************************************************************************************************************************
   await CLI.docker.cli.exec('images', ['--format', '"{{json .}}"', '--filter', "dangling=true"])
   .then((result:any) => {
     // console.log('Dangling Result:', result)
     const danglingImg:ImageType[] = result.parseJsonLines();

      for(let current of danglingImg){
        //if the allUnusedImagesSet (which tracks in the begining all ids) contains an current.ID from the idsForallImagesUsedByContainerSet we want to remove
        //that current.ID with the goal of only having a set of ids for unused images. 
        if(allUnusedImagesSet.has(current.ID)) allUnusedImagesSet.delete(current.ID);

       //IF THE ID FROM THE DANGLING IMAGES COMMAND EXISTS WITHIN THE idsForallImagesUsedByContainerSet we should not add it to our storage['dangling-images']
       if(!idsForallImagesUsedByContainerSet.has(current.ID)){
        //  console.log('NOT IN USE ID',current.ID)

        // //PUSH DATA TO ALL DATA OBJ
        //  allData.data['dangling-images'].push({
        //    ID: current.ID, 
        //    Size: current.Size, 
        //    CreatedSince: current.CreatedSince, 
        //    Tag: current.Tag,
        //    Type: 'Image'
        //  })
        
        //  storage['dangling-images'] += strToNumb(current.Size);
         storage['dangling-images'] += checkBytesAndConvertToNumber(current.Size);

       }
      }
   })

  //FOR UNUSED IMAGES*************************************************************************************************************************
   //we iterate through the allUnusedImageSet 
  allUnusedImagesSet.forEach((unusedImageID:string) => {
    //Get the Data from the allImagesObj .. and add it to storage as well as the allData obj.
    // const num = strToNumb(allImagesObj[unusedImageID].Size)
    // const str = allImagesObj[unusedImageID].Size
    // console.log('str',str,'num',num)
    
    // storage['unused-images'] += strToNumb(allImagesObj[unusedImageID].Size)

    storage['unused-images'] += checkBytesAndConvertToNumber(allImagesObj[unusedImageID].Size) 

    // allData.data['unused-images'].push({
    //   ID: allImagesObj[unusedImageID].ID, 
    //   Size: allImagesObj[unusedImageID].Size, 
    //   CreatedSince: allImagesObj[unusedImageID].CreatedSince, 
    //   Tag: allImagesObj[unusedImageID].Tag,
    //   Type: 'Image'
    // })
  })


  //For Built Casche
  await CLI.docker.cli.exec('builder', ['du', '--verbose'])
  .then((results:any) => {
    // console.log('build casche', results.parseJsonLines())
    // console.log('parseDockerBuilderDUOutput(results) -->', parseDockerBuilderDUOutput(results.stdout))
    storage['built-casche'] = totalStorageParser(results.stdout)
  })
  

  //For EXITED Containers *******************************************************************************************************************

  await CLI.docker.cli.exec('ps', ['--all', '--format', '"{{json .}}"', '--filter', "status=exited"])
  .then((result:any) => {
    const exitedCont:ContainerType[] = result.parseJsonLines();
    //storage['unused-containers'] = 
    const containerSum =  exitedCont.reduce((sum:number,current:ContainerType)=>{ 
      // console.log('Exited Container Size in getStorage.tsx',current.Size)
      const virtualStringConverter = containerVirtualSizeConverterToString(current.Size)
      //The checkBytesAndConvertToNumber function checks the type of Bytes (kb, mb, gb or byte) & converts to megabytes 
      //in the form of a number */
      // console.log('checkBytesAndConvertToNumber(virtualStringConverter) ', checkBytesAndConvertToNumber(virtualStringConverter) )
      return sum + checkBytesAndConvertToNumber(virtualStringConverter) 
    }, 0)

    // storage['unused-containers'] = containerSum;
    storage['exited-containers'] = roundTwoDecimalPlaces(containerSum);
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
    const containerSum =  pausedCont.reduce((sum:number,current:ContainerType)=>{ 

      //add paused container ids to the set
      pausedContainerIdSet.add(current.ID)
      // console.log('paused Container Size in getStorage.tsx',current.Size)
      const virtualStringConverter = containerVirtualSizeConverterToString(current.Size)
      //The checkBytesAndConvertToNumber function checks the type of Bytes (kb, mb, gb or byte) & converts to megabytes 
      //in the form of a number */
      // console.log('checkBytesAndConvertToNumber(virtualStringConverter) ', checkBytesAndConvertToNumber(virtualStringConverter) )
      return sum + checkBytesAndConvertToNumber(virtualStringConverter) 
    }, 0)

    // storage['unused-containers'] = containerSum;
    storage['paused-containers'] = roundTwoDecimalPlaces(containerSum);
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
      // console.log('Running Container Size in getStorage.tsx',container.Size)
      const virtualStringConverter = containerVirtualSizeConverterToString(container.Size);
      const sizeNum = checkBytesAndConvertToNumber(virtualStringConverter);
      // console.log('sizeNum', sizeNum)
      storage['running-containers'] +=  sizeNum 

    }
  }
})



  // console.log("storage['unused-containers']", storage['unused-containers'])

  storage['combinedTotal'] = storage['dangling-images'] + storage['in-use-images'] + storage['unused-images'] + storage['running-containers'] +  storage['exited-containers'] + storage['paused-containers'] + storage['built-casche']
  // console.log('storage', storage)
  return allData.storage;
}

export default getStorage;




