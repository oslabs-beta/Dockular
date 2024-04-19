export function PruneSelected() {}


// const pruningFunc = async (prune:string, selectedImageArray:any = apiRef.current.getSelectedRows()) => {

//     console.log('selectedImageArray', selectedImageArray)
    
//      const imageIdsToSpread = [];
//       for(let el of selectedImageArray){
//         console.log('el', el)
//         console.log('el[0]', el[0]);
//         console.log('el[1]', el[1]);
//         //the selectedImageArray above that is passed in as an argument retains the information of the prior 
//         //selected rows with the value of undefined rather than a number. We utilized the conditional statement
//         //below to ensure that no undefined values are passed into imageIdsToSpread. 
//         if(el[1] !== undefined){
//           imageIdsToSpread.push(el[1].id);
//         }

//       }

//       // prunes images based off ids passed into the command below. 
//        await  ddClient.docker.cli.exec('rmi', [...imageIdsToSpread])

//       //resets the cpu storage to an empty obejct once the images selected in the grid have been pruned
//       setCpuStorageById(cpuStorage => ({
//         'unused-containers': {...cpuStorage['unused-containers']},
//         'dangling-images': {}
//       }))

//       //resets the containers state to an empty array
//        setContainers([]);

//       //command to update the containers state to be filled with the current images within the grid
//        await ddClient.docker.cli.exec('images', ['--format', '"{{json .}}"', '--filter', "dangling=true"])
//         .then((result) => {
//           setContainers(result.parseJsonLines());
//         });
        
//   }