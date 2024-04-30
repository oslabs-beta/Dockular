import {stringToNumConverter as strToNumb} from '../utilities/StringToNumConverter'
import { totalStorageParser } from './totalStorageParser';
import { containerVirtualSizeConverterToString } from './ContainerVirtualSizeConverterToString';
import { checkBytesAndConvertToNumber } from '../utilities/ CheckBytesAndConvertToNumber';
import { roundTwoDecimalPlaces } from '../utilities/RoundTwoDecimalPlaces';


 async function GetAllStorage(CLI:any){
  const storage = {
    'unused-containers': 0, 
    'in-use-images' : 0,
    'dangling-images': 0,
    'unused-images': 0,
    'all-images': 0,
    'built-casche': 0,
    'combinedTotal': 0
  };


  //Tracks all ids of images.. We will start this out with all image ids and then remove in use image ids and dangling image ids as we obtain them. 
  const allImageIDTrackerSetForUnusedImages = new Set();

  const allImagesObj :any = {}; 
  //we want to keep a track of all the repositorys that are not equal to <none>. This assists us in parsing out which images are in use. 
  const allImageRepositoriesObj:any = {}; // {Repository:{ID, Size}}
  //track all unsused images data... will start will all images and will result into only unused images due to removing in use or dangling image ids 
  const getUnusedImgDataObj :any = {}; 
  //tracks data for dangling images -> dangling images can be both in use and dangling we need to seperate these because the user will have issues when pruning all at once in this category
  const getDanglingImageDataobj :any= {}; 
  //tracks data for in use images

  const allData:any = {storage: storage, data: {
    'in-use-images':[],
    'dangling-images': [], 
    'unused-images':  [], 
    'unused-containers': [], 
    'built-casche': [],
   }
  }

  
  //ALL IMAGES*******************************************************************************************************************************************************************************
  await CLI.docker.cli.exec('images', ['--format', '"{{json .}}"', '-a'])
  .then((result:any) => {
    // console.log('Dangling Result:', result)
    const AllImgs = result.parseJsonLines();
    AllImgs.forEach((el:any) => {
      // console.log('All Images ', el)

      //we only want to add to the allImageRepositoriesObj if the image repository within all the images has a repository name..we dont want the ones with <none>
      if(!el.Repository.match('<none>'))  allImageRepositoriesObj[el.Repository] = {ID: el.ID, Size: el.Size}

      //we need to have a list of all available images seperately to utlize in the code below when finding in use or dangling images. 
      allImagesObj[el.ID] = {ID: el.ID, Size: el.Size, Repository: el.Repository, CreatedSince: el.CreatedSince}

      //we want to fill the getUnusedImgDataObj with all images keys and values because we are going tbe deleting the values that are in use and or dangling in the code below. 
      getUnusedImgDataObj[el.ID] = {ID: el.ID, Size: el.Size, Repository: el.Repository, CreatedSince: el.CreatedSince}
      
      allImageIDTrackerSetForUnusedImages.add(el.ID)

      storage['all-images'] += checkBytesAndConvertToNumber(el.Size)
    })
  })
  

  // console.log('AllImageIDTrackerSet', allImageIDTrackerSetForUnusedImages)

  // console.log('ALL IMAGES - getUnusedImgDataObj', getUnusedImgDataObj)

  //IN USE IMAGES*******************************************************************************************************************************************************************************
  //we will utilise 'set' to make sure we dont have any repeated values. 
  const inUseRepositoryNamesSet = new Set();
  const inUseImageIdsSet = new Set(); 
  
  //Get In use Image Repository or ID from the get running containers command. The command below does not offer data on Sizes etc .. except for the 
  //id or Repository of the image depending on how the user created the image (with id or repository)...We will get the ids of these running images and compare them to 
  //our full list of images to get the data for the images themselves. 

   await CLI.docker.cli.exec('ps', ['--format', '"{{json .}}"', '-a'])
   .then((result:any) => {
    // the images below could have repeated ids or names (which is why we utilize the set). It also doesnt distinguish whether the user created a container based off the 
    // same image but utilized an image repository to create one of the containers and an image id to create the other container. Which is why we are going to convert all 
    // in use images to their ids first prior to doing anything with the data. We will not have a combination of repository and ids. 

     const allImages = result.parseJsonLines();
    //  console.log('GetAllStorage -iimagesInUse', imagesInUse)

    //We utilize this helper function to help us match the repository name from all the images and the repository name from the containers that are utilizing images.
    function getImageIdsForAllInUseImages(RepositoryOrID:any){
      let match; 
      for(let repository in allImageRepositoriesObj){
        if(RepositoryOrID.Image.match(repository)) {
          match = repository;
        } 
      }
      return match; 
    }

    //Earlier in the code when we made a docker command to  get all the image ids we created a seperate variable called allImageRepositoriesObj which contained an obj w/ keys
    //of all repository names and values of their size and id. We are looping through all the image ids from the (docker ps -a ) command which yet again gives us a list of 
    //containers and the images that they are depending on. Now we want to match the image repository names within this container command to the object we created above
    //allImageRepositoriesObj that has all image repository names. If the two match we know that this is an in use image and can then get the ids of that in use image from 
    //allImageRepositoriesObj (which has a key of repository names and values of an object with id and size of the image)

    allImages.forEach((element:any)=>{
       if(getImageIdsForAllInUseImages(element) !== undefined){
        //we are adding the Repository names that have matched from all images and the docker container command that contained a list of containers with the image ids/repository
        //they depend on.. if getImageIdsForAllInUseImages(element) comes back as undefined that means that we passed an id rather than a repository name. Remember the docker command
        //for containers lists the images the containers are depending on either as an id or repository depending on how the user created that container. 
        inUseRepositoryNamesSet.add(getImageIdsForAllInUseImages(element))
        // console.log(imageRepositoryNamesSet);
       } else {
        // console.log('element.Image', element.Image)
        //if we hit this else condition that means that getImageIdsForAllInUseImages(element) was an id rather than a repository name and we add that value to the inUseImageIdSet
        //which will also filter out any repeated values. 
        inUseImageIdsSet.add(element.Image)
       }
    })

    //Now that we have a set with all the repository names of in use images we will iterate through it 
    inUseRepositoryNamesSet.forEach((element:any) => {
      //this command will add the ids of these repository names by access the allImageRepositoriesObj which has a key of repository names and values of ids and sizes for these images.
      inUseImageIdsSet.add(allImageRepositoriesObj[element].ID)
    })


    function getAllInUseImageSizes (id:any) {
      let size;

      for(let image in allImagesObj){
        if(allImagesObj[image].ID === id){
          // id within all images matches the id within the inuse images fill the getInUseImageDataObj with all the inuse image data.
          // getInUseImageDataObj[allImagesObj[image].ID] = {ID: allImagesObj[image].ID, Size: allImagesObj[image].Size, Repository: allImagesObj[image].Repository, CreatedSince: allImagesObj[image].CreatedSince}
          allData.data['in-use-images'].push({ID: allImagesObj[image].ID, Size: allImagesObj[image].Size, Repository: allImagesObj[image].Repository, CreatedSince: allImagesObj[image].CreatedSince})
          //return the size of the inuse image 
          size = allImagesObj[image].Size
          //delete in use id from allImageIDTrackerSetForUnusedImages
          // allImageIDTrackerSetForUnusedImages.delete(allImagesObj[image].ID)
          
          //delete in use id key from getUnusedImgDataObj
          delete getUnusedImgDataObj[allImagesObj[image].ID]
        }
      }
      return size
    }

    inUseImageIdsSet.forEach((element:any) => {
      let inUseImgSize = getAllInUseImageSizes(element)
      storage['in-use-images'] += checkBytesAndConvertToNumber(inUseImgSize)

    })
   })

  //  console.log('IN USE - AllImageIDTrackerSet', allImageIDTrackerSetForUnusedImages)
  //  console.log('DELETE IN USE IMAGES - getUnusedImgDataObj', getUnusedImgDataObj)


  //Dangling Images****************************************************************************************************************************************************************************
  
   //lets create a seperate obj to track dangling images and then have a sperate piece of code remove the dangling image data. 

  await CLI.docker.cli.exec('images', ['--format', '"{{json .}}"', '--filter', "dangling=true"])
  .then((result:any) => {
    const danglingImg = result.parseJsonLines();
    // [el.ID] = {ID: el.ID, Size: el.Size, Repository: el.Repository, CreatedSince: el.CreatedSince
    
    danglingImg.forEach((el:any) => {
      getDanglingImageDataobj[el.ID] = {ID: el.ID, Size: el.Size, Repository: el.Repository, CreatedSince: el.CreatedSince}
      // allData.data['dangling-images'].push({ID: el.ID, Size: el.Size, Repository: el.Repository, CreatedSince: el.CreatedSince})
    })

    storage['dangling-images'] = danglingImg.reduce((sum:any,current:any)=>{

      //if the getUnusedImgDataObj has a dangling img id delete it from the obj
      // if(getUnusedImgDataObj[current.ID]) delete getUnusedImgDataObj[current.ID]; 


      //delete dangling image id from allImageIDTrackerSetForUnusedImages
      // allImageIDTrackerSetForUnusedImages.delete(current.ID)

      //delete in use id key from getUnusedImgDataObj
      delete getUnusedImgDataObj[current.ID]
      return sum + strToNumb(current.Size);
    }, 0);
  })

  //lets iterate through the in use image ids and remove the id we dont need from the dangling images. 

  inUseImageIdsSet.forEach((el:any) =>{
    //delete the in use dangling image from the getDanglingImageDataObj
    delete getDanglingImageDataobj[el];

    //delete in use id key from getUnusedImgDataObj
    delete getUnusedImgDataObj[el.ID]
  })

  //gets the most up to data dangling image data and pushes into alldata 
  for(let key in getDanglingImageDataobj) {
    // getDanglingImageDataobj[el.ID] = {ID: el.ID, Size: el.Size, Repository: el.Repository, CreatedSince: el.CreatedSince}
    allData.data['dangling-images'].push({
        ID: getDanglingImageDataobj[key].ID, 
        Size: getDanglingImageDataobj[key].Size, 
        Repository: getDanglingImageDataobj[key].Repository, 
        CreatedSince: getDanglingImageDataobj[key].CreatedSince
      })

  }

  // console.log('DANLING - allImageIDTrackerSet', allImageIDTrackerSetForUnusedImages)
  // console.log('DELETE Dangling IMAGES - getUnusedImgDataObj', getUnusedImgDataObj)


   //UNUSED IMAGES*************************************************************************************************************************************************************************
     

   //Now that we have all the ids and data from getUnusedImgDataObj. We can Aquire all of the sizes and data for all of these unused images. 
    for(let key in getUnusedImgDataObj){
      // console.log('checkBytesAndConvertToNumber(getUnusedImgDataObj[key].Size)', checkBytesAndConvertToNumber(getUnusedImgDataObj[key].Size))
      storage['unused-images'] += checkBytesAndConvertToNumber(getUnusedImgDataObj[key].Size)
      
      //fills all the data for the unused-images. 
      allData.data['unused-images'].push({ID: getUnusedImgDataObj[key].ID, Size: getUnusedImgDataObj[key].Size, Repository: getUnusedImgDataObj[key].Repository, CreatedSince: getUnusedImgDataObj[key].CreatedSince})
    }
   
    console.log("storage['unused-images']", storage['unused-images'] )

    // console.log('inUseAndDanglingIdObj',inUseAndDanglingIdObj)
    // console.log('inUseIdObj', inUseIdObj)
    // console.log('unusedImgDataArr', unusedImgDataArr)





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
      // console.log('checkBytesAndConvertToNumber(virtualStringConverter) ', checkBytesAndConvertToNumber(virtualStringConverter) )
      return sum + checkBytesAndConvertToNumber(virtualStringConverter) 
    }, 0)

    // storage['unused-containers'] = containerSum;
    storage['unused-containers'] = roundTwoDecimalPlaces(containerSum);
    // console.log("storage['unused-containers']", storage['unused-containers'])
    // console.log('roundThreeDecimalPlaces', roundTwoDecimalPlaces(containerSum))
  })

  // console.log("storage['unused-containers']", storage['unused-containers'])

  storage['combinedTotal'] = storage['dangling-images'] + storage['unused-containers'] + storage['built-casche']

  console.log('allData', allData)
  return storage;
}

export default GetAllStorage;

