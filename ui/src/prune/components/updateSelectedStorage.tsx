

export default function updateSelectedStorage(currentCat:any, storageSizeById:any, selectedGridRowStorageSize:any, setSelectedGridRowStorageSize:any ){
	const selectedImageStorageSizeArray = Object.values(storageSizeById[currentCat]);
	const storageUsageCalculation:any = selectedImageStorageSizeArray.reduce((sum: any, num: any)=> sum + num, 0);
	
	// switch (currentCat){
	// 	case 
	// }
}

 //storageSizeById, selectedGridRowStorageSize, setSelectedGridRowStorageSize