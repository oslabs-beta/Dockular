//Utilized in Prune.tsx, GetAllStorage.tsx
export function containerVirtualSizeConverterToString(sizeString:string) {
    // console.log('sizeString',sizeString);
    const lastIndex = sizeString.indexOf("(");
    return sizeString.slice(0, lastIndex-1);
}

