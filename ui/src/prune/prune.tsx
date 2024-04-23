import React, { useEffect } from 'react';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import { createDockerDesktopClient } from '@docker/extension-api-client';
import { Box, Container } from '@mui/material';
import { blueGrey, red} from '@mui/material/colors';
import { Stack } from "@mui/material";
//mui grid
import { DataGrid, GridRowsProp, GridColDef, GridEventListener} from '@mui/x-data-grid';
import { useGridApiRef } from '@mui/x-data-grid';
//components
import GetAllStorage from './components/getAllStorage'
//utilities
import { BuiltCascheRowDataParser } from './utility/builtCascheRowDataParser';
import { storageNumToStr } from './utility/StorageNumtoStr';
//Docker Desktop Client
const client = createDockerDesktopClient();
function useDockerDesktopClient() {
  return client;
}


export function Prune() {

  const ddClient = useDockerDesktopClient();
  //state for dataGrid
  const apiRef = useGridApiRef();
  //state trackings whether we have clicked dangling-images, unsused containers or built-casche
  const [dataGridBlueButtonType, setDataGridBlueButtonType] = React.useState<string>('dangling-images');
  //state that manages a list of all the dangling images, unused containers, and builtCasche
  const [dataForGridRows, setDataForGridRows] = React.useState<any[]>([]);
  //initialize state for containers, images and builtCasche to be set to an empty object. Contains key of id and value of storage size. 
  const [storageSizeById, setStorageSizeById] = React.useState<{ [key: string]: any }>({
    'unused-containers':{}, 
    'dangling-images': {}, 
    'built-casche': {}
  })

  //state that manages the current amount of storage size used from each selected image/container/builtCasche from the Data Grid component
  //The storage you've selected within each category
  const [selectedGridRowStorageSize, setSelectedGridRowStorageSize] =  React.useState<{ [key: string]: any }>({
    'unused-containers': 0, 
    'dangling-images': 0, 
    'built-casche': 0,
    'selectedTotal': 0, 
  })

  //state that manages the total amount of storage being used by unused-containers, dangling-images, built-casche and the combined-total
  const [totalStorageTypes, setTotalStorageTypes] = React.useState<{ [key: string]: any }>({
    'unused-containers': 0, 
    'dangling-images': 0,
    'built-casche': 0,
    'combinedTotal': 0
  })

  
  useEffect(()=>{
    //gets the total amount of storage being used by each category and the combined total
       GetAllStorage(ddClient).
       then(res => {    
        setTotalStorageTypes({
          'unused-containers':  res['unused-containers'], 
          'dangling-images':  res['dangling-images'],
          'built-casche':  res['built-casche'],
          'combinedTotal': res['combinedTotal']
        })
       })
  }, [])
  
  //keeps track of state change in dataGridBlueButtonType and changes state in dataForGridRows state depending on selection of dangling-images,unused-container, or built casche
  useEffect(()=>{
    //command populates all dangling images
     if (dataGridBlueButtonType === 'dangling-images'){
        ddClient.docker.cli.exec('images', ['--format', '"{{json .}}"', '--filter', "dangling=true"])
        .then((result) => {
          console.log('parsed images in prune file', result.parseJsonLines())
          setDataForGridRows(result.parseJsonLines());
        });
      //command populates all unused containers 
    } else if(dataGridBlueButtonType === 'unused-containers'){
        ddClient.docker.cli.exec('ps', ['--all', '--format', '"{{json .}}"', '--filter', "status=exited"])
        .then((result) => {
          setDataForGridRows(result.parseJsonLines());
        })
        //command populates all built casche
      } else if(dataGridBlueButtonType === 'built-casche'){
        ddClient.docker.cli.exec('builder', ['du', '--verbose'])
        .then((result) => {
          // console.log('result.stdout within useEffect in prune file -->', result.stdout)
          // console.log('Parsed BuiltCascheRowDataParser(result) in prune useEffect', JSON.parse(BuiltCascheRowDataParser(result.stdout)))
          setDataForGridRows(JSON.parse(BuiltCascheRowDataParser(result.stdout)));
        })
      }  
  },[dataGridBlueButtonType])


  //This eventListener helps us keep track of the boxes selected/unselected in the grid by id and the size of each image based off id
  const handleRowClick: GridEventListener<'rowClick'> = (params) => {
 
    if(dataGridBlueButtonType === 'dangling-images'){

      //user has selected row in dangling-images
      const imageSizeStr = params.row.size; //storage size
      //assumes images are only in megabytes, may have to consider kb, b or gb? Built casche has these values(mb,kb,b)
      const currImageCpu = Math.trunc(Number(imageSizeStr.slice(0, length-2))); 

      //if image id is NOT in the object
      if(!storageSizeById['dangling-images'].hasOwnProperty(params.row.id)){
        //key is id and the value is the storage size 
        setStorageSizeById(storageSize => ({
          'unused-containers': {...storageSize['unused-containers']},
          'dangling-images': {...storageSize['dangling-images'], [params.row.id] : currImageCpu},
          'built-casche' : {...storageSize['built-casche']}
        }))
      } else {
        //else user has unselected row. Remove the key/value pair from storageSizeById.
        const copyOfImgCpuObj = {'unused-containers': {...storageSizeById['unused-containers']}, 
        'dangling-images': {...storageSizeById['dangling-images']}, 
        'built-casche': {...storageSizeById['built-casche']}};

        delete copyOfImgCpuObj['dangling-images'][params.row.id]; 

        setStorageSizeById(imgStorageSize=>({
          ...copyOfImgCpuObj
        }))
      }

    } else if (dataGridBlueButtonType === 'unused-containers'){
      //user has selected row in unused-containers
      console.log('selected unused-containers in Data Grid EventListener')

    } else if(dataGridBlueButtonType === 'built-casche'){
      //user has selected row in 'built-casche'
       
       const builtCascheSizeStr = params.row.size; //storage size
       //assumes images are only in megabytes, may have to consider kb, b or gb? Built casche has these values(mb,kb,b)
       const currbuiltCascheStorage = Math.trunc(Number(builtCascheSizeStr.slice(0, length-2))); 
 
       //if image id is NOT in the object
       if(!storageSizeById['built-casche'].hasOwnProperty(params.row.id)){
         //key is id and the value is the storage size 
         setStorageSizeById(storageSize => ({
           'unused-containers': {...storageSize['unused-containers']},
           'dangling-images': {...storageSize['dangling-images']},
           'built-casche' : {...storageSize['built-casche'],[params.row.id] : currbuiltCascheStorage}
         }))
       } else {
         //else user has unselected row. Remove the key/value pair from storageSizeById.
         const copyForBuiltCasche = {
         'unused-containers': {...storageSizeById['unused-containers']}, 
         'dangling-images': {...storageSizeById['dangling-images']}, 
         'built-casche': {...storageSizeById['built-casche']}
        };
 
         delete copyForBuiltCasche['built-casche'][params.row.id]; 
 
         setStorageSizeById(imgStorageSize=>({
           ...copyForBuiltCasche
         }))
       }
    }
  };

  //useEffect fires when we select or prune a dangling-image, unused-conatiner or built-casche
  useEffect(()=>{
    //we set the totalStorageTypes state with the most updated amount of storage size utilized by each type, ex: unused-containers, dangling images, etc. 
    //this shouldnt be called when we are only selecting but it is because everything is overlapping. 
    GetAllStorage(ddClient).
       then(res => {
        setTotalStorageTypes({
          'unused-containers':  res['unused-containers'], 
          'dangling-images':  res['dangling-images'],
          'built-casche': res['built-casche'],
          'combinedTotal':  res['combinedTotal'], 
        })
       })

    //if the selected rows are within the dangling-images
    if(dataGridBlueButtonType === 'dangling-images'){
      //we get all the number values from the storageSizeById object in an array format
      const selectedImageCpuSizeArray = Object.values(storageSizeById['dangling-images']); //Example: [14,14,30]
      //we sum up all these values using the reduce method
      const cpuUsageCalculation:any = selectedImageCpuSizeArray.reduce((sum: any, num: any)=> sum + num, 0); 

      const cpuUsageCalculationResult = setSelectedGridRowStorageSize({
        'unused-containers': selectedGridRowStorageSize['unused-containers'], 
        'dangling-images': cpuUsageCalculation,
        'built-casche': selectedGridRowStorageSize['built-casche']
      //otherwise the unit value of cpuUsageCalculation is in gigabytes
      }) 



    } else if(dataGridBlueButtonType === 'unused-containers'){

      console.log('selected unused-container in prune useEffect that follows storageSizeById')

    } else if(dataGridBlueButtonType === 'built-casche'){

       //we get all the number values from the storageSizeById object in an array format
       const selectedImageCpuSizeArray = Object.values(storageSizeById['built-casche']); //Example: [14,14,30]
       //we sum up all these values using the reduce method
       //assumes images are only in megabytes, may have to consider kb, b or gb? Built casche has these values(mb,kb,b)
       const cpuUsageCalculation:any = selectedImageCpuSizeArray.reduce((sum: any, num: any)=> sum + num, 0); 
 

      const cpuUsageCalculationResult = setSelectedGridRowStorageSize({
        'unused-containers': selectedGridRowStorageSize['unused-containers'], 
        'dangling-images': selectedGridRowStorageSize['dangling-images'],
        'built-casche': cpuUsageCalculation
      //otherwise the unit value of cpuUsageCalculation is in gigabytes
      }) 

      console.log('selected built-casche in prune useEffect that follows storageSizeById', storageSizeById)
    }
  }, [storageSizeById]);


  
  //function does pruning commands depending on prune state
  const pruningFunc = async (prune:String, selectedImageArray:any = apiRef.current.getSelectedRows()) => {

    console.log('selectedImageArray', selectedImageArray)

    if(prune === 'prune-all') {
    } else if(prune === 'prune-selected') {
     const imageIdsToSpread = [];
      for(let el of selectedImageArray){
        //the selectedImageArray above that is passed in as an argument retains the information of the prior 
        //selected rows with the value of undefined rather than a number. We utilized the conditional statement
        //below to ensure that no undefined values are passed into imageIdsToSpread. 
        if(el[1] !== undefined){
          imageIdsToSpread.push(el[1].id);
        }
      }

      // prunes images based off ids passed into the command below. 
       await  ddClient.docker.cli.exec('rmi', [...imageIdsToSpread])

      //resets the storage size for images to an empty object once the selected dangling-images have been pruned
      setStorageSizeById(storageSize => ({
        'unused-containers': {...storageSize['unused-containers']},
        'dangling-images': {},
        'built-casche': {...storageSize['built-casche']}

      }))

      //resets the dataForGridRows state to an empty array
      setDataForGridRows([]);

      //since we reset the dataForGridRows state above we want to refill this state with the remaining images
      //so the dataGrid could fill the rows with the remaining data from the images.
       await ddClient.docker.cli.exec('images', ['--format', '"{{json .}}"', '--filter', "dangling=true"])
        .then((result) => {
          setDataForGridRows(result.parseJsonLines());
        });
   } else {
   }
  }
 
  //sets columns/headers in dataGrid 
  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 150 },
    { field: 'size', headerName: 'Size', width: 150 },
    { field: 'created', headerName: 'Created', width: 150 },
    { field: 'status', headerName: 
      dataGridBlueButtonType === 'dangling-images'? 'Tag' :
      dataGridBlueButtonType === 'unused-containers'? 'Status' : 'Reclaimable', width: 150 }
  ];

  //sets row data in dataGrid 
  const rows: GridRowsProp = dataForGridRows.map((image) => ({
    id:image.ID,
    size:image.Size,
    created: dataGridBlueButtonType === 'dangling-images' ? image.CreatedSince : 
    dataGridBlueButtonType === 'unused-containers'? image.RunningFor : image.CreatedSince,
    status: dataGridBlueButtonType === 'dangling-images' ? image.Tag : 
    dataGridBlueButtonType === 'unused-containers'? image.Status : image.Reclaimable
  }));


  return (
    <>
        <Container
            sx={{
                width: '95vw',
                height: '85vh',
                bgcolor: blueGrey[50],
                display: 'flex',
                flexDirection: 'column',
                border:2,
                borderColor:'primary.main'
            }}>
          <Box 
          sx={{
            width: '90vw',
            height: '40vh',
            bgcolor: blueGrey[50],
            display: 'flex',
            justifyContent:'space-around',
            marginTop:4

        }}>
            <Box 
            sx={{
                bgcolor: blueGrey[50],
                width:'25%', 
                height:'90%',
                borderRadius: 2,
                border:2,
                borderColor:'primary.main'
            }}
            >
            <Stack>
            
            <ButtonGroup variant="contained" aria-label="Basic button group" sx={{m:2}}>
            <Button variant="contained" onClick={()=>{setDataGridBlueButtonType('dangling-images')}}>
                    Dangling Images
                </Button>
                <Button variant="contained" onClick={()=>{setDataGridBlueButtonType('dangling-images')}} sx={{color: '#FFD700'}}>
                {storageNumToStr(totalStorageTypes['dangling-images'])}
                </Button>
            </ButtonGroup>
                
            <ButtonGroup variant="contained" aria-label="Basic button group" sx={{m:2}}> 
                <Button variant="contained" onClick={()=>{setDataGridBlueButtonType('unused-containers')}}>
                    Unused Containers
                </Button>
                <Button variant="contained" onClick={()=>{setDataGridBlueButtonType('unused-containers')}} sx={{color: '#FFD700'}}>
                {storageNumToStr(totalStorageTypes['unused-containers'])}
                </Button>
                </ButtonGroup>

                <ButtonGroup variant="contained" aria-label="Basic button group" sx={{m:2}}> 
                <Button variant="contained" onClick={()=>{setDataGridBlueButtonType('built-casche')}}>
                   Built Casche
                </Button>
                <Button variant="contained" onClick={()=>{}} sx={{color: '#FFD700'}}>
                {storageNumToStr(totalStorageTypes['built-casche'])}
                </Button>
                </ButtonGroup>
            </Stack>
            </Box>

            <Box sx={{
                width:'70%', 
                height:'90%',
                bgcolor: blueGrey[50],
                borderRadius: 2,
                border:2,
                borderColor:'primary.main',
                overflow: 'auto'
                }}>
                <DataGrid rows={rows} columns={columns} checkboxSelection apiRef={apiRef} onRowClick={handleRowClick} keepNonExistentRowsSelected/>
            </Box>
          </Box>

          <Box sx={{
            width: '90vw',
            height: '40vh',
            bgcolor: blueGrey[50],
            display: 'flex',
            justifyContent:'space-around',
        }}>

          <Box
            sx={{
            bgcolor: blueGrey[50],
            width:'25%', 
            height:'90%',
            borderRadius: 2,
            border:2,
            borderColor:'primary.main'
        }}> 

          <Stack>
                <Button variant="contained" color='error' onClick={()=>{pruningFunc('prune-all')}} sx={{
                    m:2,
                    p: 1,
                    borderRadius: 2
                    }}>
                    Prune All
                </Button>
                
                <Button variant="contained" color='error' onClick={()=>{pruningFunc('prune-selected')}} sx={{
                    m:2,
                    p: 1,
                    borderRadius: 2
                    }}>
                    Prune Selected
                </Button>

                <Button variant="contained" color='error' onClick={()=>{pruningFunc("scheduled-prune")}} sx={{
                    m:2,
                    p: 1,
                    borderRadius: 2
                }}>
                    Scheduled Prune
                </Button>
            </Stack>

          </Box>

          <Box
          sx={{
            width:'70%', 
            height:'90%',
            bgcolor: blueGrey[50],
            borderRadius: 2,
            border:2,
            borderColor:'primary.main',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }}> 
       
            {` Selected Storage: ${storageNumToStr(selectedGridRowStorageSize['dangling-images'])}  / Total Storage: ${storageNumToStr(totalStorageTypes['combinedTotal'])} ` }

            

            {/* {` 
            Selected Storage: ${selectedGridRowStorageSize['combinedTotal'].cpu >= 1000 ? `${selectedGridRowStorageSize['combinedTotal'].cpu/1000} GB`: `${selectedGridRowStorageSize['combinedTotal'].cpu} MB`} 
             / Total Storage: ${totalStorageTypes['combinedTotal'].cpu >= 1000 ? 
             `${totalStorageTypes['combinedTotal'].cpu/1000} GB`: `${totalStorageTypes['combinedTotal'].cpu} MB`} 
            `} */}
            
            </Box>
          </Box>
        </Container>
    </>
  );
} 


