//Utilized in Prune.tsx, GetAllStorage.tsx
export function containerVirtualSizeConverterToString(sizeString:string) {
    // 0B (virtual 761MB) -> 0B
    const lastIndex = sizeString.indexOf("(");
    // if(lastIndex === -1) {
    //     console.log('containerVirtualSizeConverterToString sizeString', sizeString)
    //     console.log('containerVirtualSizeConverterToString', sizeString.slice(0, lastIndex-1))
    //     // throw new Error('Parameter is not a Virtual Size');
    // }
    return sizeString.slice(0, lastIndex-1);
}

