import { it, expect } from "vitest";
import { BuiltCascheRowDataParser } from "../prune/utilities/builtCascheRowDataParser";

it('should return a string', ()=>{
    //ARRANGE
    const output = 
`
ID:		jff09gm6sx2tbt9bor2lc0hq5
Created at:	2024-08-02 05:48:58.578626801 +0000 UTC
Mutable:	true
Reclaimable:	true
Shared:		false
Size:		225.2MB
Description:	local source for context
Usage count:	23
Last used:	7 seconds ago
Type:		source.local
    
ID:		kqm6513pyys1or6973eynotjc
Parent:		bciswm61e9qn60z0eyt3m0lmb
Created at:	2024-08-06 05:33:57.991287379 +0000 UTC
Mutable:	false
Reclaimable:	true
Shared:		false
Size:		225.2MB
Description:	[client-builder 6/7] COPY ui /ui
Usage count:	1
Last used:	4 days ago
Type:		regular

Shared:		36.1MB
Private:	5.913GB
Reclaimable:	5.949GB
Total:		5.949GB
    `;

    //ACT
    const result = BuiltCascheRowDataParser(output)

    //ASSERT
    expect(result).toBeTypeOf('string');
});




it('should parse each cache into an object with keys: {ID, Size, CreatedSince Reclaimable}, push each object into an array and strinify the array ', ()=>{
    //ARRANGE
    const output = 
`
ID:		jff09gm6sx2tbt9bor2lc0hq5
Created at:	2024-08-02 05:48:58.578626801 +0000 UTC
Mutable:	true
Reclaimable:	true
Shared:		false
Size:		225.2MB
Description:	local source for context
Usage count:	23
Last used:	7 seconds ago
Type:		source.local

ID:		kqm6513pyys1or6973eynotjc
Parent:		bciswm61e9qn60z0eyt3m0lmb
Created at:	2024-08-06 05:33:57.991287379 +0000 UTC
Mutable:	false
Reclaimable:	true
Shared:		false
Size:		225.2MB
Description:	[client-builder 6/7] COPY ui /ui
Usage count:	1
Last used:	4 days ago
Type:		regular

Shared:		36.1MB
Private:	5.913GB
Reclaimable:	5.949GB
Total:		5.949GB
    `;

    //ACT
    const result = BuiltCascheRowDataParser(output)

    //ASSERT

    // const filteredArr = output.split('\n').filter((el:string)=> el.match(/ID/g) || el.match(/Size/g) || el.match(/Last/g) || el.match(/Reclaimable/g));
    // const resArr = []; 

    // for(let i = 0; i < filteredArr.length; i+=1){
    //     type ParsedObjType = {ID:string, Size:string, CreatedSince:string, Reclaimable:string};
    //     const cacheObj: ParsedObjType = {ID: 'id', Size: 'size', CreatedSince: '', Reclaimable: 'False'};
        
    //     if(filteredArr[i].match(/ID/g)) cacheObj.ID = filteredArr[i]
    //     if(filteredArr[i].match(/Size/g)) cacheObj.Size = filteredArr[i]
    //     if(filteredArr[i].match(/Reclaimable/g)) cacheObj.Reclaimable = filteredArr[i]
    //     if(filteredArr[i].match(/Last/g)) {
    //         cacheObj.CreatedSince = filteredArr[i]
    //         resArr.push(cacheObj);
    //     }

    // }

    const resArr = [{ID: 'jff09gm6sx2tbt9bor2lc0hq5', Size: '225.2MB', CreatedSince: '7 seconds ago', Reclaimable:'true'}, {ID: 'kqm6513pyys1or6973eynotjc', Size: '225.2MB', CreatedSince: '4 days ago', Reclaimable:'true'}]
    const expectedResult = JSON.stringify(resArr);
    expect(result).toEqual(expectedResult);
})

