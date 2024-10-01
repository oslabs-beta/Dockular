import { Box } from '@mui/material';
import { blueGrey } from '@mui/material/colors';
import { useEffect } from 'react';
import { createDockerDesktopClient } from '@docker/extension-api-client';

//Mui Grid
import { DataGrid, GridRowsProp, GridColDef, GridEventListener} from '@mui/x-data-grid';
import { GridCellParams } from '@mui/x-data-grid';


//utilities
import { dataGridTypeHeaderHelper } from '../utilities/dataGridTypeHeaderHelper';
import { containerVirtualSizeConverterToString } from '../utilities/ContainerVirtualSizeConverterToString';
import { rowColumnTypeHelper } from '../utilities/GetAllStorage/rowColumnTypeHelper';
import { BuiltCascheRowDataParser } from '../utilities/Parsers/builtCascheRowDataParser';
import GetRunningContainers from '../utilities/GetAllStorage/GetRunningContainers';
import GetAllStorage from '../utilities/GetAllStorage/GetAllStorage';
import { checkBytesAndConvertToNumber } from '../utilities/ CheckBytesAndConvertToNumber';
//Docker Desktop Client
const client = createDockerDesktopClient();
function useDockerDesktopClient() {
  return client;
}

//contextApi
import { CentralizedStateContext } from '../context/CentralizedStateContext';
import { useContext } from 'react';

//TYPES
import { ImageType, StorageSizeType, SelectedRowSizeType, ContainerType, BuildCacheType } from '../../types';


export function TopRightComponent(props:any) {

 const ddClient = useDockerDesktopClient();


 type BlueButtonType = 
    'running-containers' |
    'exited-containers' |
    'paused-containers'| 
    'dangling-images'| 
    'in-use-images'|
    'unused-images' |
    'built-casche' ;

  interface dataGridBlueButtonTypeInterface {
    dataGridBlueButtonType: BlueButtonType,
    setDataGridBlueButtonType :React.Dispatch<React.SetStateAction<string>>
  }
  
  const {dataGridBlueButtonType, setDataGridBlueButtonType} = useContext<dataGridBlueButtonTypeInterface>(CentralizedStateContext)


  type dataForGridRowType = ImageType[] | ContainerType[] | BuildCacheType[]; 

  interface dataForGridRowsInterface {
    dataForGridRows: dataForGridRowType,
    setDataForGridRows: React.Dispatch<React.SetStateAction<dataForGridRowType>>
  }

  const {dataForGridRows, setDataForGridRows} = useContext<dataForGridRowsInterface>(CentralizedStateContext)


  interface storageSizeByIdInterface { 
    storageSizeById: StorageSizeType
    setStorageSizeById :  (value: React.SetStateAction<StorageSizeType>) => void
  };

  const { storageSizeById, setStorageSizeById} = useContext<storageSizeByIdInterface>(CentralizedStateContext); 

 
  interface selectedGridRowStorageSizeInterface {
    selectedGridRowStorageSize: SelectedRowSizeType,
    setSelectedGridRowStorageSize :React.Dispatch<React.SetStateAction<SelectedRowSizeType>>
  }
  const { selectedGridRowStorageSize, setSelectedGridRowStorageSize} = useContext<selectedGridRowStorageSizeInterface>(CentralizedStateContext); 

   
  //keeps track of state change in dataGridBlueButtonType and changes state in dataForGridRows state depending on selection of dangling-images,unused-container, or built casche
  useEffect(()=>{
    
    //command populates all dangling images
     if (dataGridBlueButtonType === 'dangling-images'){
       
      GetAllStorage(ddClient, 'data').
      then(res => {    
      setDataForGridRows(res.data['dangling-images'])
      })
      // .catch((err)=>{`Error in second use Effect tracking dataGridBlueButtonType within prune.tsx (DANGLING IMAGES) - Docker command in: GetAllStorage module ${err}`}) 

      //COMMAND POPULATES UNUSED IMAGES
     } else if(dataGridBlueButtonType === 'unused-images') {
      GetAllStorage(ddClient, 'data').
      then(res => {    

        // console.log("res.data['unused-images']", res.data['unused-images']); 

      setDataForGridRows(res.data['unused-images'])
      })
      // .catch((err)=>{`Error in second use Effect tracking dataGridBlueButtonType within prune.tsx (UNUSED IMAGES) - Docker command in: GetAllStorage module ${err}`})  

    //command populates all 'in-use-images'
    } else if(dataGridBlueButtonType === 'in-use-images'){

      GetAllStorage(ddClient, 'data').
      then(res => {    
        // console.log(res)
      setDataForGridRows(res.data['in-use-images'])
      
      })
      // .catch((err)=>{`Error in second use Effect tracking dataGridBlueButtonType within prune.tsx (IN USE IMAGES) - Docker command in: GetAllStorage module${err}`})  

      //EXITED CONTAINERS 
    } else if(dataGridBlueButtonType === 'exited-containers'){
        ddClient.docker.cli.exec('ps', ['--all', '--format', '"{{json .}}"', '--filter', "status=exited"])
        .then((result) => {
          // console.log('psAll',result.parseJsonLines())
          setDataForGridRows(result.parseJsonLines());
          
        })
        // .catch((err)=>{`Error in second use Effect tracking dataGridBlueButtonType within prune.tsx (EXITED CONTAINERS) - command: ddClient.docker.cli.exec('ps', ['--all', '--format', '"{{json .}}"', '--filter', "status=exited"]) ${err}`})

          //Paused Containers
      } else if(dataGridBlueButtonType === 'paused-containers'){
        ddClient.docker.cli.exec('ps', ['--all', '--format', '"{{json .}}"', '--filter', "status=paused"])
        .then((result) => {
          // console.log('psAll',result.parseJsonLines())
          const pausedContainers:ContainerType[] = result.parseJsonLines()
          setDataForGridRows(pausedContainers);
          
        })
        // .catch((err)=>{`Error in second use Effect tracking dataGridBlueButtonType within prune.tsx (PAUSED CONTAINERS) - command: ddClient.docker.cli.exec('ps', ['--all', '--format', '"{{json .}}"', '--filter', "status=exited"]) ${err}`})

        //RUNNING CONTAINERS
      }else if(dataGridBlueButtonType === 'running-containers'){
        GetRunningContainers(ddClient)
        .then(result => { 
          // console.log('running containers', res)   
        setDataForGridRows(result)
        })
        // .catch((err)=>{`Error in second use Effect tracking dataGridBlueButtonType within prune.tsx (RUNNING CONTAINERS) Docker command in: GetRunningContainers module ${err}`})  
       
        //command populates all built casche
      }else if(dataGridBlueButtonType === 'built-casche'){
        ddClient.docker.cli.exec('builder', ['du', '--verbose'])
        .then((result) => {
          // console.log('result.stdout within useEffect in prune file -->', result.stdout)
          // console.log('Parsed BuiltCascheRowDataParser(result) in prune useEffect', JSON.parse(BuiltCascheRowDataParser(result.stdout)))
          setDataForGridRows(JSON.parse(BuiltCascheRowDataParser(result.stdout)));
        })
        // .catch((err)=>{`Error in use Effect within prune.tsx for BUILD CACHE - command: ddClient.docker.cli.exec('builder', ['du', '--verbose']) ${err}`})
      }  
      
  },[dataGridBlueButtonType])


  //This eventListener helps us keep track of the boxes selected/unselected in the grid by id and the size of each image based off id
  const handleCellClick: GridEventListener<'cellClick'> = (params: GridCellParams<any>) => {
  
      // user has selected row in dangling-images
      const imageStorageSize:string = params.row.size; //storage size
      const currImageSize =  checkBytesAndConvertToNumber(imageStorageSize)
      //assumes images are only in megabytes, may have to consider kb, b or gb? Built casche has these values(mb,kb,b)
      // const currImageSize = Math.trunc(Number(imageStorageSize.slice(0, length-2))); 
      console.log('currImageSize', currImageSize)
       // if image id is NOT in the object
      if(!storageSizeById[dataGridBlueButtonType].hasOwnProperty(params.row.id)){
        
        //key is id and the value is the storage size 
        setStorageSizeById(storageSize => (
          {
          ...storageSize,
          [dataGridBlueButtonType]: {...storageSize[dataGridBlueButtonType], [params.row.id] : currImageSize},
    
        }));
        
        /*we want to add to the selectedTotal - selectedGridRowStorageSize - within here because this is the logic
         that controls whether we SELECT the row. */
         setSelectedGridRowStorageSize(currSelectedStorage => ({
          ...currSelectedStorage,
          'selectedTotal': currSelectedStorage['selectedTotal'] + currImageSize, 
        }))
       
      } else {
        //else user has unselected row. Remove the key/value pair from storageSizeById.
        const copyOfImgCpuObj = {...storageSizeById };
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
  };

  //Fires in general? Because the storage size is being filled.  YES IT DOES !!!
  //useEffect fires when we select or prune a dangling-image, unused-conatiner or built-casche
  //This useEffect is utilized to update our circular chart.
  //THIS MAY BE THE CONTAINER THAT HELPS US REFILL THE VALUES WITHIN THE DATA GRID? 

  useEffect(()=>{
    // we set the totalStorageTypes state with the most updated amount of storage size utilized by each type, ex: unused-containers, dangling images, etc. 
    // this shouldnt be called when we are only selecting but it is because everything is overlapping. Its also called everytime we render in general
        
        //if the selected rows are within the images/containers/casche etc.. 
        //we get all the number values from the storageSizeById object in an array format
        const selectedImageCpuSizeArray = Object.values(storageSizeById[dataGridBlueButtonType]); //Example: [14,14,30]
  
        // console.log('selectedImageCpuSizeArray', selectedImageCpuSizeArray)
  
        //we sum up all these values using the reduce method
        const cpuUsageCalculation:number = selectedImageCpuSizeArray.reduce((sum: number, num: number)=> sum + num, 0); 
  
        // console.log('cpuUsageCalculation', cpuUsageCalculation)
  
        setSelectedGridRowStorageSize({
           ...selectedGridRowStorageSize,
           dataGridBlueButtonType: cpuUsageCalculation,
        }) ;

  }, [storageSizeById]);


    //We are utilizing the rowColumnTypeHelper module to have a seperation of concerns. It will essentially
  //return the string we are looking for in the column or row of the datagrid. 

  //sets columns/headers in dataGrid 
   const columns: GridColDef[] = [
    { field: 'status', headerName: 'Status', width: 130 },
    { field: 'id', headerName: 'ID', width: 135 },
    { field: 'size', headerName: 'Size', width: 115},
    { field: 'created', headerName: 'Created', width: 135 },
    { field: 'RepoOrImage', headerName: rowColumnTypeHelper(dataGridBlueButtonType, 'col', 'RepoOrImage', {} ), width: 145 },
    { field: 'TagOrName', headerName: rowColumnTypeHelper(dataGridBlueButtonType, 'col', 'TagOrName', {} ),width: 135}, 
      //created a type field so we can utilize and be able to distinguish whether we are pruning 
      //a container, image or cache within the pruning function. The getSelectedRows() returns
      //an array of objects with these fields. We also need to distinguid because each type
      //has different pruning commands. 
    { field: 'type', headerName: 'Type', width: 130 },
  ];

  //sets row data in dataGrid 
  const rows: GridRowsProp =  dataForGridRows.map((type) => ({
    id:type.ID,
    size: dataGridBlueButtonType === 'exited-containers' ? containerVirtualSizeConverterToString(type.Size): 
    dataGridBlueButtonType === 'paused-containers' ? containerVirtualSizeConverterToString(type.Size) :
    dataGridBlueButtonType === 'running-containers' ? containerVirtualSizeConverterToString(type.Size): type.Size ,
    created:  rowColumnTypeHelper(dataGridBlueButtonType, 'row', 'created', type),
    TagOrName:  rowColumnTypeHelper(dataGridBlueButtonType, 'row', 'TagOrName', type),
    RepoOrImage:  rowColumnTypeHelper(dataGridBlueButtonType, 'row', 'RepoOrImage', type),
    status: rowColumnTypeHelper(dataGridBlueButtonType, 'row', 'status', type),
    type: rowColumnTypeHelper(dataGridBlueButtonType, 'row', 'type', type)
  }));


  //Build cache, in use images and paused containers are not selectable so we want to remove the checkboxes when we are in the rows of the buid cache
  function selectDataGrid (strType:string) {
    // console.log('strType', strType)
    if(strType === 'built-casche'){
        return <DataGrid 
        rows={rows} 
        columns={columns} 
        apiRef={props.apiRef} 
        sx={{
          "& .MuiDataGrid-columnHeaderCheckbox .MuiDataGrid-columnHeaderTitleContainer": {
            display: "none"
          }
        }}
        />
    } 

    else {
        return <DataGrid 
        rows={rows} 
        columns={columns} 
        checkboxSelection 
        apiRef={props.apiRef} 
        onCellClick={handleCellClick}
        keepNonExistentRowsSelected
        sx={{
          "& .MuiDataGrid-columnHeaderCheckbox .MuiDataGrid-columnHeaderTitleContainer": {
            display: "none"
          }
        }}
        />
    }
}

    return (
      
        <Box sx={{
            width:'70%', 
            height:'90%',
            bgcolor: blueGrey[50],
            borderRadius: 2,
            border:2,
            borderColor:'primary.main',
            // borderColor:'yellow',
            overflow: 'auto',
            // display: 'flex',
            // flexDirection: 'column',
            // alignItems: 'center'
            }}>
           
            <Box sx={{
              color: 'primary.main',
              fontWeight: 'bold',
              fontStyle: 'italic',
              textAlign: 'center',
              marginTop: 1,
            }}
            >{dataGridTypeHeaderHelper(dataGridBlueButtonType)}
            </Box>

            <Box>
            {selectDataGrid(dataGridBlueButtonType)}
            </Box>
            
       </Box>
    )
}

