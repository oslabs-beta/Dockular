//Utilized in Prune.tsx 
export function dataGridTypeHeaderHelper(buttonSelectedType:string) {

    
    if(buttonSelectedType === 'exited-containers') {  
        return 'Exited Containers'
    } else if (buttonSelectedType === 'paused-containers') {
        return 'Paused Containers'
    } else if (buttonSelectedType === 'running-containers') {
        return 'Running Containers'
    } else if (buttonSelectedType === 'dangling-images'){
        return 'Dangling Images'
    }  else if (buttonSelectedType === 'in-use-images'){
        return 'In Use Images'
    } else if (buttonSelectedType === 'unused-images'){
        return 'Unused Images'
    } else if (buttonSelectedType ===  'built-casche'){
        return  'Build Cache - Beta'
    } 
    
    
 }
 
 