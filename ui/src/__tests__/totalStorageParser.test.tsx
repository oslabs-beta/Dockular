import { it, expect } from "vitest";
import { totalStorageParser } from "../prune/modules/totalStorageParser";

it('should return a number',()=>{

    //ARRANGE 
    const output2 = 
`ID:		jff09gm6sx2tbt9bor2lc0hq5
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
    const result = totalStorageParser(output2)

    //ASSERT
    expect(result).toBeTypeOf('number');
})

it('should return the number 0 if the Build Cache is empty',()=>{

    //ARRANGE 
    const output = `
Reclaimable:	0B
Total:		0B
    `;
    
    //ACT
    const result = totalStorageParser(output)

    //ASSERT
    expect(result).toBe(0);

})

it('should convert the "total storage size string" into a number and return that number multiplied by 1000 (if the total build cache size is in GB)',()=>{

    //ARRANGE 
    const output1 = `5.949GB`;

    const output2 = 
`ID:		jff09gm6sx2tbt9bor2lc0hq5
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
    const result = totalStorageParser(output2)

    //ASSERT
    const convertBuiltCascheToNumber = Number(output1.slice(0, output1.length-2));
    const expectedResult = convertBuiltCascheToNumber * 1000;

    expect(result).toBe(expectedResult);
})


it('should convert the "total storage size string" into a number (if the total build cache size is in MB',()=>{
        
    //ARRANGE 
    const output1 = `450.4MB`;
    
    const output2 = 
`ID:		jff09gm6sx2tbt9bor2lc0hq5
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
Private:	450.4MB
Reclaimable:	450.4MB
Total:		450.4MB
    `;
        
        //ACT
        const result = totalStorageParser(output2)
    
        //ASSERT
        const expectedResult =  Number(output1.slice(0, output1.length-2));
        expect(result).toBe(expectedResult);
    })
    