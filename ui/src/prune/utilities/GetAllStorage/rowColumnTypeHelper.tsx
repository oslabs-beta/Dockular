import {ImageType, ContainerType, BuildCacheType} from '../../../types'

//Utilized in Prune.tsx 
export function rowColumnTypeHelper (buttonType:string, rowOrCol:string, field:string, typeElement: {[key:string]:string}) {

    // console.log('typeElement', typeElement)
    
    if(rowOrCol === 'col'){
    //Images
        if(buttonType === 'dangling-images' && field === 'TagOrName'){
            return 'Tag';
        } else if(buttonType === 'in-use-images' && field === 'TagOrName' ){
            // console.log('in-use-image header -->', 'Tag')
            return 'Tag';
        } else if(buttonType === 'unused-images' && field === 'TagOrName' ){
            // console.log('in-use-image header -->', 'Tag')
            return 'Tag';
        } else if(buttonType === 'dangling-images' && field === 'RepoOrImage' ){
            // console.log('in-use-image header -->', 'Tag')
            return 'Repository';
         } else if(buttonType === 'in-use-images' && field === 'RepoOrImage' ){
            // console.log('in-use-image header -->', 'Tag')
         return 'Repository';
         }  else if(buttonType === 'unused-images'&& field === 'RepoOrImage' ){
         // console.log('in-use-image header -->', 'Tag')
         return 'Repository';
        }

    //Containers
        else if(buttonType === 'exited-containers' && field === 'TagOrName'){
            return 'Name';
        } else if(buttonType === 'paused-containers' && field === 'TagOrName'){
            return 'Name';
        } else if(buttonType === 'running-containers' && field === 'TagOrName'){
            return 'Name';
        }  else if(buttonType === 'exited-containers' && field === 'RepoOrImage'){
            return 'Image';
        } else if(buttonType === 'paused-containers' && field === 'RepoOrImage'){
            return 'Image';
        } else if(buttonType === 'running-containers' && field === 'RepoOrImage'){
            return 'Image';
        } 
        
        
        //Build Cache
        else {
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
            
            
        } else if(field === 'TagOrName'){

            if(buttonType === 'dangling-images'){
                return typeElement.Tag

            } else if(buttonType === 'in-use-images'){

                return typeElement.Tag

            } else if(buttonType === 'unused-images'){

                return typeElement.Tag

            } else if(buttonType === 'exited-containers'){

                return typeElement.Names

            } else if(buttonType === 'paused-containers'){

                return typeElement.Names

            } else if(buttonType ===  'running-containers'){

                return typeElement.Names

            }else {

                return typeElement.Reclaimable // build cache

           } 
           
         } else if(field === 'RepoOrImage'){

            if(buttonType === 'dangling-images'){
                return typeElement.Repository

            } else if(buttonType === 'in-use-images'){

                return typeElement.Repository

            } else if(buttonType === 'unused-images'){

                return typeElement.Repository

            } else if(buttonType === 'exited-containers'){

                return typeElement.Image

            } else if(buttonType === 'paused-containers'){

                return typeElement.Image

            } else if(buttonType ===  'running-containers'){

                return typeElement.Image

            }else {

                return typeElement.Reclaimable // build cache

           }

        } else if(field === 'status'){

            if(buttonType === 'dangling-images'){
                return 'Dangling Image'

            } else if(buttonType === 'in-use-images'){

                return 'In Use Image'

            } else if(buttonType === 'unused-images'){

                return 'Unused Image'

            } else if(buttonType === 'exited-containers'){

                return typeElement.State

            } else if(buttonType === 'paused-containers'){

                return typeElement.State

            } else if(buttonType ===  'running-containers'){

                return typeElement.State

            }else {

                return 'Build Cache' // build cache

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

