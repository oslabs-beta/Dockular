//UTILIZED BY: GetAllStorage component 

export function stringToNumConverter(sizeString:string) {
    const isVirtual = sizeString.match(/virtual/g);
    if(isVirtual){
        //"0B (virtual 249MB)"
    //   sizeString.match[/[0-9][0-9][0-9]MB/g]
    }else{
      return Math.trunc(Number(sizeString.slice(0, length-2)));
    }
    
}