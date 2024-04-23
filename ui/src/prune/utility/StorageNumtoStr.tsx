export function storageNumToStr(numb:number){
  if(numb>= 1000) return `${numb/1000}GB`
  else{
    return `${numb}MB`
  }
}