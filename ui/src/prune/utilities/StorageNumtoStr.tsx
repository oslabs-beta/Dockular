import { roundTwoDecimalPlaces } from "./RoundTwoDecimalPlaces"



export function storageNumToStr(numb:number){
  
  // console.log('numb in storageNumToStr', numb)

  if(numb >= 1000) {
    return `${roundTwoDecimalPlaces(numb/1000)}GB`
  } else if(numb < 1){
    return `${roundTwoDecimalPlaces(numb*1000)}KB`
  } else {
    return `${roundTwoDecimalPlaces(numb)}MB`
  }
}