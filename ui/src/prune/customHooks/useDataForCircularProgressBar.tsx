import { StorageSizeType, SelectedRowSizeType } from '../../types';

 type BlueButtonType = 
    'running-containers' |
    'exited-containers' |
    'paused-containers'| 
    'dangling-images'| 
    'in-use-images'|
    'unused-images' |
    'built-casche';
 
export default function useDataForCircularProgressBar(dataGridBlueButtonType:BlueButtonType, storageSizeById:StorageSizeType, selectedGridRowStorageSize:SelectedRowSizeType, setSelectedGridRowStorageSize:React.Dispatch<React.SetStateAction<SelectedRowSizeType>>) {
     //if the selected rows are within the images/containers/casche etc.. 

        //we get all the number values from the storageSizeById object in an array format
        const selectedImageCpuSizeArray = Object.values(storageSizeById[dataGridBlueButtonType]); //Example: [14,14,30]
  
        // console.log('selectedImageCpuSizeArray', selectedImageCpuSizeArray)
  
        //we sum up all these values using the reduce method
        const cpuUsageCalculation:number = selectedImageCpuSizeArray.reduce((sum: number, num: number)=> sum + num, 0); 
  
        // console.log('cpuUsageCalculation', cpuUsageCalculation)
  
        const cpuUsageCalculationResult = setSelectedGridRowStorageSize({
           ...selectedGridRowStorageSize,
           dataGridBlueButtonType: cpuUsageCalculation,
        }) ;
      }
       
         
 