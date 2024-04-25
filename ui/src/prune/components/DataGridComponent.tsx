import { DataGrid } from '@mui/x-data-grid';


export function DataGridComponent(props:any) {


function selectDataGrid (strType:any) {
    if(strType === 'built-casche'){
        //NO CHECKBOX SELECTION
        return <DataGrid 
        rows={props.rows} 
        columns={props.columns} 
        apiRef={props.apiRef} 
        onRowClick={props.handleRowClick} 
        keepNonExistentRowsSelected/>
    } else {
        return <DataGrid 
        rows={props.rows} 
        columns={props.columns} 
        checkboxSelection 
        apiRef={props.apiRef} 
        onRowClick={props.handleRowClick} 
        keepNonExistentRowsSelected/>
    }
}


    return (
        <>
        {selectDataGrid(props.type)}
        </>
    )
}