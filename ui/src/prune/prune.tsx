import React, { useEffect } from 'react';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import { createDockerDesktopClient } from '@docker/extension-api-client';
import { Box, Container } from '@mui/material';
import { blueGrey, red} from '@mui/material/colors';
import { Stack } from "@mui/material";
import { DataGrid, GridRowsProp, GridColDef, GridEventListener} from '@mui/x-data-grid';
import { useGridApiRef } from '@mui/x-data-grid';

// import {GetAllStorage} from './pullAllData';
import GetAllStorage from './pullAllData'

const client = createDockerDesktopClient();

function useDockerDesktopClient() {
  return client;
}

export function Prune() {

  const ddClient = useDockerDesktopClient();

  //state trackings whether we have clicked dangling-images or unsused containers
  const [response, setResponse] = React.useState<string>('dangling-images');
  //state that manages a list of all the dangling images and all the unused containers
  const [containers, setContainers] = React.useState<any[]>([]);
  //initialize state for containers and images to be set to an empty object. Contains key of id and value of cpu usage. 
  const [cpuStorageById, setCpuStorageById] = React.useState<{ [key: string]: any }>({'unused-containers':{}, 'dangling-images': {}})
  //state that manages the current amount of cpu used from each selected image/container from the Data Grid component
  const [currentCpu, setCurrentCpu] =  React.useState<{ [key: string]: any }>({'unused-containers': {cpu: 0, unit: 'mb'}, 'dangling-images': {cpu: 0, unit: 'mb'}})

  //state for dataGrid
  const apiRef = useGridApiRef();

  useEffect(()=>{
    console.log("Storage Obj\n" + Object.keys(GetAllStorage(ddClient))+ '\n'+ Object.values(GetAllStorage(ddClient)))

  }, [])
  
  //keeps track of state change in response and changes state in containers depending on selection dangling-images of exited-containers
  useEffect(()=>{
    //command populates all dangling images
     if (response === 'dangling-images'){
        ddClient.docker.cli.exec('images', ['--format', '"{{json .}}"', '--filter', "dangling=true"])
        .then((result) => {
          setContainers(result.parseJsonLines());
        });
      //command populates all unused containers 
    } else if(response === 'unused-containers'){
        ddClient.docker.cli.exec('ps', ['--all', '--format', '"{{json .}}"', '--filter', "status=exited"])
        .then((result) => {
          setContainers(result.parseJsonLines());
        })
      }
  },[response])


  //This eventListener helps us keep track of the boxes selected/unselected in the grid by id and the size of each image based off id
  const handleRowClick: GridEventListener<'rowClick'> = (params) => {
   
    if(response === 'dangling-images'){
      const imageSizeStr = params.row.size; //storage/cpu
      const currImageCpu = Math.trunc(Number(imageSizeStr.slice(0, length-2)));
      //if image id is NOT in the object
      if(!cpuStorageById['dangling-images'].hasOwnProperty(params.row.id)){
        //key is id and the value is the size 
        setCpuStorageById(cpuStorage => ({
          'unused-containers': {...cpuStorage['unused-containers']},
          'dangling-images': {...cpuStorage['dangling-images'], [params.row.id] : currImageCpu}
        }))
      } else {
        //else user has unselected row. Remove the key/value pair from imgCpu obj.
        const copyOfImgCpuObj = {'unused-containers': {...cpuStorageById['unused-containers']},'dangling-images': {...cpuStorageById['dangling-images']}};
        delete copyOfImgCpuObj['dangling-images'][params.row.id]; 
        setCpuStorageById(imgCpu=>({
          ...copyOfImgCpuObj
        }))
      }
    } else {
      //user has selected containers
      console.log('selected unused-containers in Data Grid EventListener')
    }
  };

  
  useEffect(()=>{
    //{'unused-containers': {cpu: 0, unit: 'mb'}, 'dangling-images': {cpu: 0, unit: 'mb'}}
    if(response === 'dangling-images'){
      const selectedImageCpuSizeArray = Object.values(cpuStorageById['dangling-images']); //[14,14,30]
      console.log('selectedImageCpuSizeArray', selectedImageCpuSizeArray)

      const cpuUsageCalculation:any = selectedImageCpuSizeArray.reduce((sum: any, num: any)=> sum + num + 175, 0); //750mb


      const cpuUsageCalculationResult = cpuUsageCalculation < 1000 ? setCurrentCpu({
        'unused-containers': currentCpu['unused-containers'], 'dangling-images': {cpu: cpuUsageCalculation, unit: 'mb'}
      }) : setCurrentCpu({
        'unused-containers': currentCpu['unused-containers'], 'dangling-images': {cpu: cpuUsageCalculation/1000, unit: 'gb'}
      })
    } else {
      console.log('selected unused-container in useEffect')
    }
    
  }, [cpuStorageById]);


  
  //function does pruning commands depending on prune state
  const pruningFunc = async (prune:String, selectedImageArray:any = apiRef.current.getSelectedRows()) => {

    console.log('selectedImageArray', selectedImageArray)

    if(prune === 'prune-all') {

    } else if(prune === 'prune-selected') {
    
     const imageIdsToSpread = [];
      for(let el of selectedImageArray){
        console.log('el', el)
        console.log('el[0]', el[0]);
        console.log('el[1]', el[1]);
        //the selectedImageArray above that is passed in as an argument retains the information of the prior 
        //selected rows with the value of undefined rather than a number. We utilized the conditional statement
        //below to ensure that no undefined values are passed into imageIdsToSpread. 
        if(el[1] !== undefined){
          imageIdsToSpread.push(el[1].id);
        }

      }

      // prunes images based off ids passed into the command below. 
       await  ddClient.docker.cli.exec('rmi', [...imageIdsToSpread])

      //resets the cpu storage to an empty obejct once the images selected in the grid have been pruned
      setCpuStorageById(cpuStorage => ({
        'unused-containers': {...cpuStorage['unused-containers']},
        'dangling-images': {}
      }))

      //resets the containers state to an empty array
       setContainers([]);

      //command to update the containers state to be filled with the current images within the grid
       await ddClient.docker.cli.exec('images', ['--format', '"{{json .}}"', '--filter', "dangling=true"])
        .then((result) => {
          setContainers(result.parseJsonLines());
        });
   } else {
   }
  }
 
  const rows: GridRowsProp = containers.map((image) => ({
    id:image.ID,
    size:image.Size,
    created: response === 'dangling-images' ? image.CreatedSince : image.RunningFor,
    status: response === 'dangling-images' ? image.Tag : image.Status
  }));

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 150 },
    { field: 'size', headerName: 'Size', width: 150 },
    { field: 'created', headerName: 'Created', width: 150 },
    { field: 'status', headerName: response === 'dangling-images'? 'Tag' : 'Status' , width: 150 }
  ];
  
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
            <Button variant="contained" onClick={()=>{setResponse('dangling-images')}}>
                    Dangling Images
                </Button>
                <Button variant="contained" onClick={()=>{setResponse('dangling-images')}}>
                {/* {'unused-containers': {cpu: 0, unit: 'mb'}, 'dangling-images': {cpu: 0, unit: 'mb'}} */}
                 {`${currentCpu['dangling-images'].cpu} ${currentCpu['dangling-images'].unit}`}
                </Button>
            </ButtonGroup>
                
            <ButtonGroup variant="contained" aria-label="Basic button group" sx={{m:2}}> 
                <Button variant="contained" onClick={()=>{setResponse('unused-containers')}}>
                    Unused Containers
                </Button>
                <Button variant="contained" onClick={()=>{setResponse('unused-containers')}}>
                {/* {'unused-containers': {cpu: 0, unit: 'mb'}, 'dangling-images': {cpu: 0, unit: 'mb'}} */}
                {`${currentCpu['unused-containers'].cpu} ${currentCpu['unused-containers'].unit}`}
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
 
            </Box>
          </Box>
        </Container>
    </>
  );
} 






// import React, { useEffect } from 'react';
// import Button from '@mui/material/Button';
// import ButtonGroup from '@mui/material/ButtonGroup';
// import { createDockerDesktopClient } from '@docker/extension-api-client';
// import { Box, Container } from '@mui/material';
// import { blueGrey, red} from '@mui/material/colors';
// import { Stack } from "@mui/material";
// import { DataGrid, GridRowsProp, GridColDef, GridEventListener } from '@mui/x-data-grid';
// import { useGridApiRef } from '@mui/x-data-grid';
 

// // import { GuageChartComponent } from './chart';
// // import { GuageChartComp } from './chart/guageChartComp';

// const client = createDockerDesktopClient();

// function useDockerDesktopClient() {
//   return client;
// }

// export function Prune() {

//   const ddClient = useDockerDesktopClient();

//   //state trackings whether we have clicked dangling-images or unsused containers
//   const [response, setResponse] = React.useState<string>('dangling-images');
//   //state that manages a list of all the dangling images and all the unused containers
//   const [containers, setContainers] = React.useState<any[]>([]);
//   //initialize images state to be set to an empty object. Contains key of id and value of cpu usage. 
//   const [imgCpu, setImageCpu] = React.useState<{ [key: string]: any }>({})
//   //state that manages whether we are in megabytes or gigabytes.
//   const [mbOrGb, setMbOrGb] = React.useState<string>('mb');
//   //state that tracks megabyte cpu usage.
//   const [megabyteCpuUsage, setMegabyteCpuUsage] =  React.useState<number>(0);
//   //state that tracks gigabyte cpu usage.
//   const [gigabyteCpuUsage, setGbCpuUsage] =  React.useState<number>(1);
//   //state for dataGrid
//   const apiRef = useGridApiRef();

 


  
//   //keeps track of state change in response and changes state in containers depending on selection dangling-images of exited-containers
//   useEffect(()=>{
//     //command populates all dangling images
//      if (response === 'dangling-images'){
//         ddClient.docker.cli.exec('images', ['--format', '"{{json .}}"', '--filter', "dangling=true"])
//         .then((result) => {
//           setContainers(result.parseJsonLines());
//         });
//       //command populates all unused containers 
//     } else if(response === 'unused-containers'){
//         ddClient.docker.cli.exec('ps', ['--all', '--format', '"{{json .}}"', '--filter', "status=exited"])
//         .then((result) => {
//           setContainers(result.parseJsonLines());
//         })
//       }
//   },[response])

  

//   //This eventListener helps us keep track of the boxes selected/unselected in the grid by id and the size of each image based off id
//   const handleRowClick: GridEventListener<'rowClick'> = (params) => {
     
//       const imageSizeStr = params.row.size;
//       const currImageCpu = Math.trunc(Number(imageSizeStr.slice(0, length-2)));
      
//       //if image id is NOT in the object
//       if(!imgCpu.hasOwnProperty(params.row.id)){
//         //key is id and the value is the size 
//         setImageCpu({...imgCpu, [params.row.id] : currImageCpu});
//       } else {
//         //else user has unselected row. Remove the key/value pair from imgCpu obj.
//         const copyOfImgCpuObj = {...imgCpu};
//         delete copyOfImgCpuObj[params.row.id]; 
//         setImageCpu(imgCpu=>({
//           ...copyOfImgCpuObj
//         }))
//       }
//   };



//   useEffect(()=>{
//     const selectedImageCpuSizeArray = Object.values(imgCpu);
//     const mbCpuUsageCalculation = selectedImageCpuSizeArray.reduce((sum,num)=> sum + num + 175, 0);

//     //if mbCpuUsageCalculation is over 1000 we are going to set the mbOrGb state to 'gb'.. it is originally set at 'mb'
//     if(mbCpuUsageCalculation >= 1000) setMbOrGb('gb'); 
      
//     //each 1000 mg is 1 gb... so if we are below 1000 mb we enter this conditional
//     if(mbOrGb === 'mb'){

//         //update the megaByteCpuUsage state to represent the current cpu used by selected images
//         setMegabyteCpuUsage(mbCpuUsageCalculation)

//       } else {

//         //we calculate the left over mbytes used prior to entering 1gb.
//         const leftOverMegabyteCpu = mbCpuUsageCalculation - 1000;
//         console.log('leftover cpu state',  leftOverMegabyteCpu);

//        } 

//   }, [imgCpu]);


  
//   //function does pruning commands depending on prune state
//   const pruningFunc = async (prune:String, selectedImageArray = apiRef.current.getSelectedRows()) => {
//     if(prune === 'prune-all') {

//     } else if(prune === 'prune-selected') {
    
//      const imageIdsToSpread = [];
//       for(let el of selectedImageArray){
//         imageIdsToSpread.push(el[1].id);
//       }
//       // console.log(imageIdsToSpread)
//       // docker image prune -a --filter
//        await  ddClient.docker.cli.exec('rmi', [...imageIdsToSpread])
   
//        setContainers([]);

//        await ddClient.docker.cli.exec('images', ['--format', '"{{json .}}"', '--filter', "dangling=true"])
//         .then((result) => {
//           setContainers(result.parseJsonLines());
//         });
//    } else {
//    }
//   }
 
//   const rows: GridRowsProp = containers.map((image) => ({
//     id:image.ID,
//     size:image.Size,
//     created: response === 'dangling-images' ? image.CreatedSince : image.RunningFor,
//     status: response === 'dangling-images' ? image.Tag : image.Status
//   }));

//   const columns: GridColDef[] = [
//     { field: 'id', headerName: 'ID', width: 150 },
//     { field: 'size', headerName: 'Size', width: 150 },
//     { field: 'created', headerName: 'Created', width: 150 },
//     { field: 'status', headerName: response === 'dangling-images'? 'Tag' : 'Status' , width: 150 }
//   ];
  
//   return (
//     <>
//         <Container
//             sx={{
//                 width: '95vw',
//                 height: '85vh',
//                 bgcolor: blueGrey[50],
//                 display: 'flex',
//                 flexDirection: 'column',
//                 border:2,
//                 borderColor:'primary.main'
//             }}>
//           <Box 
//           sx={{
//             width: '90vw',
//             height: '40vh',
//             bgcolor: blueGrey[50],
//             display: 'flex',
//             justifyContent:'space-around',
//             marginTop:4

//         }}>
//             <Box 
//             sx={{
//                 bgcolor: blueGrey[50],
//                 width:'25%', 
//                 height:'90%',
//                 borderRadius: 2,
//                 border:2,
//                 borderColor:'primary.main'
//             }}
//             >
//             <Stack>
//             <ButtonGroup variant="contained" aria-label="Basic button group" sx={{m:2}}>
//             <Button variant="contained" onClick={()=>{setResponse('dangling-images')}}>
//                     Dangling Images
//                 </Button>
//                 <Button variant="contained" onClick={()=>{setResponse('dangling-images')}}>
//                     900 mb
//                 </Button>
//             </ButtonGroup>
                
//             <ButtonGroup variant="contained" aria-label="Basic button group" sx={{m:2}}> 
//                 <Button variant="contained" onClick={()=>{setResponse('unused-containers')}}>
//                     Unused Containers
//                 </Button>
//                 <Button variant="contained" onClick={()=>{setResponse('unused-containers')}}>
//                     900 mb
//                 </Button>
//                 </ButtonGroup>
//             </Stack>
//             </Box>

//             <Box sx={{
//                 width:'70%', 
//                 height:'90%',
//                 bgcolor: blueGrey[50],
//                 borderRadius: 2,
//                 border:2,
//                 borderColor:'primary.main',
//                 overflow: 'auto'
//                 }}>
//                 <DataGrid rows={rows} columns={columns} checkboxSelection apiRef={apiRef} onRowClick={handleRowClick}/>
//             </Box>
//           </Box>

//           <Box sx={{
//             width: '90vw',
//             height: '40vh',
//             bgcolor: blueGrey[50],
//             display: 'flex',
//             justifyContent:'space-around',
//         }}>

//           <Box
//             sx={{
//             bgcolor: blueGrey[50],
//             width:'25%', 
//             height:'90%',
//             borderRadius: 2,
//             border:2,
//             borderColor:'primary.main'
//         }}> 

//           <Stack>
//                 <Button variant="contained" color='error' onClick={()=>{pruningFunc('prune-all')}} sx={{
//                     m:2,
//                     p: 1,
//                     borderRadius: 2
//                     }}>
//                     Prune All
//                 </Button>
                
//                 <Button variant="contained" color='error' onClick={()=>{pruningFunc('prune-selected')}} sx={{
//                     m:2,
//                     p: 1,
//                     borderRadius: 2
//                     }}>
//                     Prune Selected
//                 </Button>

//                 <Button variant="contained" color='error' onClick={()=>{pruningFunc("scheduled-prune")}} sx={{
//                     m:2,
//                     p: 1,
//                     borderRadius: 2
//                 }}>
//                     Scheduled Prune
//                 </Button>
//             </Stack>

//           </Box>

//           <Box
//           sx={{
//             width:'70%', 
//             height:'90%',
//             bgcolor: blueGrey[50],
//             borderRadius: 2,
//             border:2,
//             borderColor:'primary.main',
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'center'
//         }}> 
//              {/* <GuageChartComponent mbCpu={megabyteCpuUsage} gbCpu={gigabyteCpuUsage} mgOrGb={mbOrGb}/> */}
//              {/* <GuageChartComp mbCpu={megabyteCpuUsage} gbCpu={gigabyteCpuUsage} mbOrGb={mbOrGb}/> */}
//             </Box>
//           </Box>
//         </Container>
//     </>
//   );
// } 