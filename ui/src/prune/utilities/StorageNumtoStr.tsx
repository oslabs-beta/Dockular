import { roundTwoDecimalPlaces } from "./RoundTwoDecimalPlaces"



export function storageNumToStr(number:number):string{
  // console.log('numb in storageNumToStr', number);

  if(number >= 1000) {
    // console.log(`${roundTwoDecimalPlaces(numb/1000)}GB`)
    return `${roundTwoDecimalPlaces(number/1000)}GB`
  } else if(number < 1){
    // console.log(`${roundTwoDecimalPlaces(numb*1000)}KB`)
    return `${roundTwoDecimalPlaces(number*1000)}KB`
  } else {
    // console.log(`${roundTwoDecimalPlaces(numb)}MB`)
    return `${roundTwoDecimalPlaces(number)}MB`
  }

}