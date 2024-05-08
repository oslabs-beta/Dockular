import { type } from "os";

//Utilized in Prune.tsx 
export function rowColumnTypeHelper (buttonType:any, rowOrCol:any, field:any, typeElement:any) {
    // console.log('rowColumnTypeHelper buttonType', buttonType)
    
    if(rowOrCol === 'col'){
        if(buttonType === 'dangling-images'){
            return 'Tag';
        } else if(buttonType === 'in-use-images'){
            // console.log('in-use-image header -->', 'Tag')
            return 'Tag';
        } else if(buttonType === 'unused-images'){
            // console.log('in-use-image header -->', 'Tag')
            return 'Tag';
        }else if(buttonType === 'exited-containers'){
            return 'Status';
        } else if(buttonType === 'paused-containers'){
            return 'Status';
        } else if(buttonType === 'running-containers'){
            return 'Status';
        } else {
            return 'Reclaimable'; // build cache
        }

       
        
    } else {

        if(field === 'created'){

             if(buttonType === 'dangling-images'){
                return typeElement.CreatedSince
            
             } else if(buttonType === 'in-use-images'){
                // console.log('in-use-image CreatedSince -->', typeElement.CreatedSince)
                return typeElement.CreatedSince

             } else if(buttonType === 'unused-images'){

                return typeElement.CreatedSince

              } else if(buttonType === 'exited-containers'){

                return typeElement.RunningFor

             } else if(buttonType === 'paused-containers'){

                return typeElement.RunningFor

             } else if(buttonType === 'running-containers'){

                return typeElement.RunningFor

             }else {
                return typeElement.CreatedSince //build cache
            }
            
            
        } else if(field === 'status'){

            if(buttonType === 'dangling-images'){
                return typeElement.Tag

            } else if(buttonType === 'in-use-images'){

                return typeElement.Tag

            } else if(buttonType === 'unused-images'){

                return typeElement.Tag

            } else if(buttonType === 'exited-containers'){

                return typeElement.State

            } else if(buttonType === 'paused-containers'){

                return typeElement.State

            } else if(buttonType ===  'running-containers'){

                return typeElement.State

            }else {

                return typeElement.Reclaimable // build cache

           }
        

        } else if(field === 'type'){

            if(buttonType === 'dangling-images'){
                return 'Image'
            } else if(buttonType === 'in-use-images'){
                // console.log('in-use-image field-->', 'Image')
                return 'Image'
            } else if(buttonType === 'unused-images'){
                // console.log('in-use-image field-->', 'Image')
                return 'Image'
            } else if(buttonType === 'exited-containers'){
                return 'Container'
            } else if(buttonType === 'paused-containers'){
                return 'Container'
            } else if(buttonType === 'running-containers'){
                return 'Container'
            } else {    
                return 'Cache' // build cache
           }
           
        }
        
    } 
    // console.log(buttonType)
    
 }

