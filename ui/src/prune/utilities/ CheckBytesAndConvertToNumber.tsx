 
import { stringToNumConverter } from "./StringToNumConverter"

export function  checkBytesAndConvertToNumber(bytesStr:string) {

    // console.log('bytesStr-->', bytesStr, bytesStr.length)
    // console.log('bytesStr[bytesStr.length-1]', bytesStr[bytesStr.length-1])
    // console.log('bytesStr[bytesStr.length-2]',bytesStr[bytesStr.length-2])
    // console.log('bytesStr[bytesStr.length-1]', bytesStr[bytesStr.length-2])
    // console.log("bytesStr.indexOf('K')", bytesStr.indexOf('k'))

    if(bytesStr[bytesStr.length-2] == "k"){
        //1000kb is 1mb
        return stringToNumConverter(bytesStr)/1000;
    } else if (bytesStr[bytesStr.length-2] == "M"){
        return stringToNumConverter(bytesStr) 
    } else if (bytesStr[bytesStr.length-2] == 'G'){
        //1gb is 1000mb
        return stringToNumConverter(bytesStr)*1000
    } else {
        return 0;
    }
 
}

