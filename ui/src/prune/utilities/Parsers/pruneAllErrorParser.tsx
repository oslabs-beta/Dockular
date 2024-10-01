 
export function pruneAllErrorParser(input:string) {

    const lines = input.split('\n');

    let errOutput = 'Unable to delete image(s):\n\n'
   
    lines.forEach((el) => {
        // return el.slice(55,67)
        const imageID = el.slice(55,67);
        const containerID = el.slice(130, 142);
        if(el.length !== 0) errOutput += `Image: ${imageID} being used by Container: ${containerID} \n\n`
       
    });
         
    return errOutput; 
  };