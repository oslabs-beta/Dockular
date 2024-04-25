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
import { DataGridComponent } from './components/DataGridComponent';
import { ProgressbarChartComponent } from './components/ProgressbarChartComponent';

//modules
import GetAllStorage from './modules/GetAllStorage';
import { BuiltCascheRowDataParser } from './modules/builtCascheRowDataParser';
import { containerVirtualSizeConverterToString } from './modules/ContainerVirtualSizeConverterToString';

//utilities
import { storageNumToStr } from './utilities/StorageNumtoStr';


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
        console.log('res in useEffect - GetAllStorage(ddClient).', res)
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
        ddClient.docker.cli.exec('ps', ['--all', '--format', '"{{json .}}"', '--filter', "status=exited", '--filter', "status=paused", '--filter', "status=created"])
        .then((result) => {
          // console.log('psAll',result.parseJsonLines())
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
          'built-casche' : {...storageSize['built-casche']},
        }))

        /*we want to add to the selectedTotal - selectedGridRowStorageSize - within here because this is the logic
         that controls whether we SELECT the row. */
         setSelectedGridRowStorageSize(currSelectedStorage => ({
          'unused-containers': currSelectedStorage['unused-containers'],
          'dangling-images': currSelectedStorage['dangling-images'],
          'built-casche': currSelectedStorage['built-casche'],
          'selectedTotal': currSelectedStorage['selectedTotal'] + currImageCpu, 
        }))

       
      } else {
        //else user has unselected row. Remove the key/value pair from storageSizeById.
        const copyOfImgCpuObj = {
        'unused-containers': {...storageSizeById['unused-containers']}, 
        'dangling-images': {...storageSizeById['dangling-images']}, 
        'built-casche': {...storageSizeById['built-casche']}};

        delete copyOfImgCpuObj['dangling-images'][params.row.id]; 

        setStorageSizeById(imgStorageSize=>({
          ...copyOfImgCpuObj
        }))

        /*we want to add to the selectedTotal - selectedGridRowStorageSize - within here because this is the logic
         that controls whether we UNSELECT the row. */
         setSelectedGridRowStorageSize(currSelectedStorage => ({
          'unused-containers': currSelectedStorage['unused-containers'],
          'dangling-images': currSelectedStorage['dangling-images'],
          'built-casche': currSelectedStorage['built-casche'],
          'selectedTotal': currSelectedStorage['selectedTotal'] - currImageCpu, 
        }))
      }

       

    } else if (dataGridBlueButtonType === 'unused-containers'){
      //user has selected row in unused-containers
      console.log('selected unused-containers in Data Grid EventListener')

    } else if(dataGridBlueButtonType === 'built-casche'){
      //user has selected row in 'built-casche'
       
       const builtCascheSizeStr = params.row.size; //storage size
       
       const currbuiltCascheStorage = Math.trunc(Number(builtCascheSizeStr.slice(0, length-2))); // storageSize converted to #
 
       //if image id is NOT in the object
       if(!storageSizeById['built-casche'].hasOwnProperty(params.row.id)){
         //key is id and the value is the storage size 
         setStorageSizeById(storageSize => ({
           'unused-containers': {...storageSize['unused-containers']},
           'dangling-images': {...storageSize['dangling-images']},
           'built-casche' : {...storageSize['built-casche'],[params.row.id] : currbuiltCascheStorage}
         }))

         /*we want to add to the selectedTotal - selectedGridRowStorageSize - within here because this is the logic
         that controls whether we SELECT the row. */
          setSelectedGridRowStorageSize(currSelectedStorage => ({
            'unused-containers': currSelectedStorage['unused-containers'],
            'dangling-images': currSelectedStorage['dangling-images'],
            'built-casche': currSelectedStorage['built-casche'],
            'selectedTotal': currSelectedStorage['selectedTotal'] + currbuiltCascheStorage
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

          /*we want to add to the selectedTotal - selectedGridRowStorageSize - within here because this is the logic
         that controls whether we UNSELECT the row. */
         setSelectedGridRowStorageSize(currSelectedStorage => ({
          'unused-containers': currSelectedStorage['unused-containers'],
          'dangling-images': currSelectedStorage['dangling-images'],
          'built-casche': currSelectedStorage['built-casche'],
          'selectedTotal': currSelectedStorage['selectedTotal'] - currbuiltCascheStorage
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

      console.log('selectedImageCpuSizeArray', selectedImageCpuSizeArray)

      //we sum up all these values using the reduce method
      const cpuUsageCalculation:any = selectedImageCpuSizeArray.reduce((sum: any, num: any)=> sum + num, 0); 

      const cpuUsageCalculationResult = setSelectedGridRowStorageSize({
        'unused-containers': selectedGridRowStorageSize['unused-containers'], 
        'dangling-images': cpuUsageCalculation,
        'built-casche': selectedGridRowStorageSize['built-casche'],
        'selectedTotal': selectedGridRowStorageSize['selectedTotal']
      }) 

    } else if(dataGridBlueButtonType === 'unused-containers'){

      console.log('selected unused-container in prune useEffect that follows storageSizeById')

    } else if(dataGridBlueButtonType === 'built-casche'){
      //No NEED TO HAVE THIS CALC FOR BUILT-CASCHE? 

      //  //we get all the number values from the storageSizeById object in an array format
      //  const selectedImageCpuSizeArray = Object.values(storageSizeById['built-casche']); //Example: [14,14,30]
      //  //we sum up all these values using the reduce method
      //  //assumes images are only in megabytes, may have to consider kb, b or gb? Built casche has these values(mb,kb,b)
      //  const cpuUsageCalculation:any = selectedImageCpuSizeArray.reduce((sum: any, num: any)=> sum + num, 0); 
 

      // const cpuUsageCalculationResult = setSelectedGridRowStorageSize({
      //   'unused-containers': selectedGridRowStorageSize['unused-containers'], 
      //   'dangling-images': selectedGridRowStorageSize['dangling-images'],
      //   'built-casche': cpuUsageCalculation,
      //   'selectedTotal': selectedGridRowStorageSize['selectedTotal']
      // }) 

      // console.log('selected built-casche in prune useEffect that follows storageSizeById', storageSizeById)
    }
  }, [storageSizeById]);


  
  //function does pruning commands depending on prune state
  const pruningFunc = async (prune:String, selectedStorageArray:any = apiRef.current.getSelectedRows()) => {

    //the selectedImageArray contains an array of objects.
    //ex: [{ key:id, value:{} }]
    //ex: [{"4012d2bb7317": {id: '4012d2bb7317', size: '14.1MB', created: '7 minutes ago', status: '<none>', type: 'Image'}}]
    console.log('selectedStorageArray', selectedStorageArray)

    if(prune === 'prune-all') {

    } else if(prune === 'prune-selected') {
      //we utilize the type field within the object to determine whether the key value pair represents and image, cache or container
      //we then split them up appropriately to be able to prune them with their associated commands. 
     let imageIdsToRemove = [];
     let containerIdsToRemove = [];
     let cascheIdsToRemove = []; 
     

      for(let el of selectedStorageArray){
        //the selectedImageArray above that is passed in as an argument retains the information of the prior 
        //selected rows with the value of undefined rather than a number. We utilized the conditional statement
        //below to ensure that no undefined values are passed into imageIdsToSpread. 
        if(el[1] !== undefined){
          // console.log('el[1]', el[1]);
          // console.log('el[0]', el[0]);
          if(el[1].type === 'Image'){
            // console.log('imageIdsToRemove.push(el[1].id); -->',el[1].id, el[1].type)
            imageIdsToRemove.push(el[1].id);
          } else if(el[1].type === 'Container'){
            // console.log('containerIdsToRemove.push(el[1].id);-->', el[1].id, el[1].type)
            containerIdsToRemove.push(el[1].id);
          } else if(el[1].type === 'Cache'){
            // console.log('cascheIdsToRemove.push(el[1].id); -->', el[1].id, el[1].type)
            cascheIdsToRemove.push(el[1].id);
          }
        }
      }


      // console.log('cascheIdsToRemove', cascheIdsToRemove)

      //There is a possibility that the user does not simultaneously prune a cache and image for example. 
      //if they decide to prune one of the types and not the other we do not want to run a command to prune
      //on the type that was not selected because it will throw an error due to not having any ids to prune. 

      // prunes images based off ids passed into the image pruning command below. 
      if(imageIdsToRemove.length > 0) await  ddClient.docker.cli.exec('rmi', [...imageIdsToRemove])
        
      // prunes images based off ids passed into the cache pruning command below. 
      // if(cascheIdsToRemove.length >0) await  ddClient.docker.cli.exec('buildx', ['rm',...cascheIdsToRemove])
    

      //reset the values within the arrays above
       imageIdsToRemove = [];
       containerIdsToRemove = [];
       cascheIdsToRemove = []; 

        
      //resets the storage size for images to an empty object once the rows for specifc types have been pruned
      setStorageSizeById(storageSize => ({
        'unused-containers': containerIdsToRemove.length > 0 ? {} : {...storageSize['unused-containers']},
        'dangling-images': imageIdsToRemove.length > 0 ? {} : {...storageSize['dangling-images']},
        'built-casche': cascheIdsToRemove.length > 0 ? {} : {...storageSize['built-casche']},
      }))


      
      //after pruning we need to reset the value within the selectedTotal key. This manages all selected rows from
      //all types - unused-containers, dangling-images and build-cache
        setSelectedGridRowStorageSize({
          'unused-containers': selectedGridRowStorageSize['unused-containers'],
          'dangling-images': selectedGridRowStorageSize['dangling-images'],
          'built-casche': selectedGridRowStorageSize['built-casche'],
          'selectedTotal': 0,
        })


      //resets the dataForGridRows state to an empty array
      setDataForGridRows([]);

     
      /*we have the conditional statement here because we want the grid to re-render the type we are in after clicking
      the selected prune button...dangling images, unused containers and builtcasche.. otherwise it could get 
      confusing if it re-renders back to dangling images everytime */

      if(dataGridBlueButtonType === 'dangling-images'){
          //since we reset the dataForGridRows state above we want to refill this state with the remaining images
          //so the dataGrid could fill the rows with the remaining data from the images.
       await ddClient.docker.cli.exec('images', ['--format', '"{{json .}}"', '--filter', "dangling=true"])
        .then((result) => {
          setDataForGridRows(result.parseJsonLines());
        });
      } else if(dataGridBlueButtonType === 'unused-containers'){
       await ddClient.docker.cli.exec('ps', ['--all', '--format', '"{{json .}}"', '--filter', "status=exited", '--filter', "status=paused", '--filter', "status=created"])
        .then((result) => {
          setDataForGridRows(result.parseJsonLines());
        })
        //command populates all built casche
      } else if(dataGridBlueButtonType === 'built-casche'){
         await ddClient.docker.cli.exec('builder', ['du', '--verbose'])
         .then((result) => {
          // console.log('result.stdout within useEffect in prune file -->', result.stdout)
          // console.log('Parsed BuiltCascheRowDataParser(result) in prune useEffect', JSON.parse(BuiltCascheRowDataParser(result.stdout)))
          setDataForGridRows(JSON.parse(BuiltCascheRowDataParser(result.stdout)));
        })
      }  

        
   } else {
   }
  }
 
  //sets columns/headers in dataGrid 
  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 150 },
    { field: 'size', headerName: 'Size', width: 100},
    { field: 'created', headerName: 'Created', width: 150 },
    { field: 'status', headerName: 
      dataGridBlueButtonType === 'dangling-images'? 'Tag' :
      dataGridBlueButtonType === 'unused-containers'? 'Status' : 'Reclaimable', width: 150},
      //created a type field so we can utilize and be able to distinguish whether we are pruning 
      //a container, image or cache within the pruning function. The getSelectedRows() returns
      //an array of objects with these fields. We also need to distinguid because each type
      //has different pruning commands. 
    { field: 'type', headerName: 'Type', width: 150 },
  ];

  //sets row data in dataGrid 
  const rows: GridRowsProp = dataForGridRows.map((image) => ({
    id:image.ID,
    size: dataGridBlueButtonType === 'unused-containers' ? containerVirtualSizeConverterToString(image.Size): image.Size,
    created: dataGridBlueButtonType === 'dangling-images' ? image.CreatedSince : 
    dataGridBlueButtonType === 'unused-containers'? image.RunningFor : image.CreatedSince,
    status: dataGridBlueButtonType === 'dangling-images' ? image.Tag : 
    dataGridBlueButtonType === 'unused-containers'? image.Status : image.Reclaimable,
    type: dataGridBlueButtonType === 'dangling-images' ? 'Image' : 
    dataGridBlueButtonType === 'unused-containers'? 'Container' : 'Cache',

  }));


  //Build cache is not selectable so we want to remove the checkboxes when we are in the rows of the buid cache
  function selectDataGrid (strType:any) {
    if(strType === 'built-casche'){
        //NO CHECKBOX SELECTION
        return <DataGrid 
        rows={rows} 
        columns={columns} 
        apiRef={apiRef} 
        />
    } else {
        return <DataGrid 
        rows={rows} 
        columns={columns} 
        checkboxSelection 
        apiRef={apiRef} 
        onRowClick={handleRowClick} 
        keepNonExistentRowsSelected/>
    }
}

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
                {/* {totalStorageTypes['unused-containers']} */}
                </Button>
                </ButtonGroup>

                <ButtonGroup variant="contained" aria-label="Basic button group" sx={{m:2}}> 
                <Button variant="contained" onClick={()=>{setDataGridBlueButtonType('built-casche')}}>
                   Build Cache
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

                {/* If we click on build casche we dont want the checkboxes to be visible since you cant prune a selected item.
                 They all have to be pruned at once. So we use the DataGridComponent to help achieve the desired results. */}
                
                {/* <DataGridComponent type={dataGridBlueButtonType} rows={rows} columns={columns} apiRef={apiRef} onRowClick={handleRowClick}/> */}
                
                {/* <DataGrid rows={rows} columns={columns} checkboxSelection apiRef={apiRef} onRowClick={handleRowClick} keepNonExistentRowsSelected/> */}
               
                {selectDataGrid(dataGridBlueButtonType)}
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
            <ProgressbarChartComponent selectedTotal={selectedGridRowStorageSize['selectedTotal']} combinedTotal={totalStorageTypes['combinedTotal']}/>
            {/* {` Selected Storage: ${storageNumToStr(selectedGridRowStorageSize['selectedTotal'])}  / Total Storage: ${storageNumToStr(totalStorageTypes['combinedTotal'])} ` }         */}
            </Box>
          </Box>
        </Container>
    </>
  );
} 


