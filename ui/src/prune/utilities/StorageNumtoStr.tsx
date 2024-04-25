import { roundThreeDecimalPlaces } from "./RoundThreeDecimalPlaces"

roundThreeDecimalPlaces

export function storageNumToStr(numb:number){
  
  console.log('numb in storageNumToStr', numb)

  if(numb >= 1000) {
    return `${roundThreeDecimalPlaces(numb/1000)}GB`
  } else if(numb < 1){
    return `${roundThreeDecimalPlaces(numb*1000)}KB`
  } else {
    return `${roundThreeDecimalPlaces(numb)}MB`
  }
}