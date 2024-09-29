 
export function pruneAllErrorParser(input:string) {

    const lines = input.split('\n');

    let errOutput = 'Unable to delete image(s):\n\n'
   
    lines.forEach((el) => {
        // return el.slice(55,67)
        const imageID = el.slice(55,67);
        errOutput += `${imageID}\n`
       
    });
         
    return errOutput; 


    // const output:string[] = []; 
    // lines.forEach((el) => {
    //     // return el.slice(55,67)
    //     const imageID = el.slice(55,67);
    //     const containerID = el.slice(130, 142);
    //     output.push(`Unable to delete image ${imageID} being used by running container ${containerID}.`)
    // });

    // let errOutput = ''

    //       for(let i = 0; i < output.length-1; i+=1){
    //         errOutput += `${output[i]}${"\n"}`
    //       };

    // return output; 

    

  };