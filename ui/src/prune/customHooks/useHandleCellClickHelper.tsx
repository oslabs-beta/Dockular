import { StorageSizeType, SelectedRowSizeType } from '../../types';


 type BlueButtonType = 
    'running-containers' |
    'exited-containers' |
    'paused-containers'| 
    'dangling-images'| 
    'in-use-images'|
    'unused-images' |
    'built-casche' ;
 
export default function useHandleCellClickHelper(params:any, dataGridBlueButtonType:BlueButtonType, storageSizeById:StorageSizeType, setStorageSizeById:(value: React.SetStateAction<StorageSizeType>) => void, setSelectedGridRowStorageSize:React.Dispatch<React.SetStateAction<SelectedRowSizeType>>) {
     
        //user has selected row in dangling-images
        const imageStorageSize:string = params.row.size; //storage size
        // console.log('dataGridBlueButtonType',dataGridBlueButtonType)
        // console.log('storageSizeById', storageSizeById)
        // console.log('storageSizeById[dataGridBlueButtonType]', storageSizeById[dataGridBlueButtonType])
        //assumes images are only in megabytes, may have to consider kb, b or gb? Built casche has these values(mb,kb,b)
        const currImageSize = Math.trunc(Number(imageStorageSize.slice(0, length-2))); 
        // console.log('currImageSize',currImageSize)

        // console.log('storageSizeById[dataGridBlueButtonType]', dataGridBlueButtonType)
        // if image id is NOT in the object
        if(!storageSizeById[dataGridBlueButtonType].hasOwnProperty(params.row.id)){
          // console.log('storageSizeById',storageSizeById)
          // console.log('storageSizeById[dataGridBlueButtonType].hasOwnProperty(params.row.id)', storageSizeById[dataGridBlueButtonType].hasOwnProperty(params.row.id))
          //key is id and the value is the storage size 
          setStorageSizeById(storageSize => ({
            ...storageSize,
            [dataGridBlueButtonType]: {...storageSize[dataGridBlueButtonType], [params.row.id] : currImageSize},
      
          }))
          
          
    
          /*we want to add to the selectedTotal - selectedGridRowStorageSize - within here because this is the logic
           that controls whether we SELECT the row. */
           setSelectedGridRowStorageSize(currSelectedStorage => ({
            ...currSelectedStorage,
            'selectedTotal': currSelectedStorage['selectedTotal'] + currImageSize, 
          }))
         
          
         
         
        } else {
          //else user has unselected row. Remove the key/value pair from storageSizeById.
          const copyOfImgCpuObj = {...storageSizeById };
          
          // console.log('copyOfImgCpuObj[dataGridBlueButtonType][params.row.id]', copyOfImgCpuObj[dataGridBlueButtonType][params.row.id])
          
         
          delete copyOfImgCpuObj[dataGridBlueButtonType][params.row.id]; 
    
          setStorageSizeById(imgStorageSize=>({
            ...copyOfImgCpuObj
          }))
    
          /*we want to add to the selectedTotal - selectedGridRowStorageSize - within here because this is the logic
           that controls whether we UNSELECT the row. */
           setSelectedGridRowStorageSize(currSelectedStorage => ({
            ...currSelectedStorage,
            'selectedTotal': currSelectedStorage['selectedTotal'] - currImageSize, 
          }))
          
         
        }
         
}