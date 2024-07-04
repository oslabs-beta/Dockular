import getStorage from "./getStorage";
import getData from "./getData";
import {TotalStorageType} from '../../../types';

import {ImageType} from '../../../types'

type allDataType = {storage:TotalStorageType; data: { [key:string]: ImageType[]}}


 async function GetAllStorage(CLI:any, storageOrData:string){
 

  const allData : allDataType = {
    
    storage: {
      'running-containers': 0,
      'exited-containers': 0, //EXITED
      'paused-containers':0,
      'dangling-images': 0,
      'in-use-images': 0,
      'unused-images':0,
      'built-casche': 0,
      'combinedTotal': 0
    },
    
    data: {
    'running-containers': [], 
    'exited-containers': [], 
    'paused-containers': [], 
    'in-use-images': [],
    'dangling-images': [], 
    'unused-images':  [], 
    'built-casche': [],
   }
  }

  if(storageOrData==='storage'){
    // console.log('getStorage(CLI)', getStorage(CLI))
    allData.storage = await getStorage(CLI)
  } else {
    // console.log('getData(CLI)', getData(CLI))

    allData.data = await getData(CLI)
  }

 return allData;
}

export default GetAllStorage;

