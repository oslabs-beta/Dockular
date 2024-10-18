// Converts string ex: '15.6MB', '201MB' -> 15.6, 201 
export function stringToNumConverter(sizeString:string):number {
      // let str = '123'
      // console.log('stringToNumConverter', Number(str.slice(0, sizeString.length-2)))
      // console.log('Number(sizeString.slice(0, sizeString.length-2)', Number(sizeString.slice(0, sizeString.length-2)))
      // console.log('Number(sizeString.slice(0, length-2))', Number(sizeString.slice(0, sizeString.length-2)))
      return Number(sizeString.slice(0, sizeString.length-2));
}