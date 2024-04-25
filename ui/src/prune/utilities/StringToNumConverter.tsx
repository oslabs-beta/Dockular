//UTILIZED BY: GetAllStorage.tsx CheckBytesAndConvertToNumber.tsx

export function stringToNumConverter(sizeString:string) {
      return Math.trunc(Number(sizeString.slice(0, length-2)));
}