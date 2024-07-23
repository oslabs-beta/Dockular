import { it, expect } from "vitest";
import {containerVirtualSizeConverterToString} from '../prune/modules/ContainerVirtualSizeConverterToString';

it('should convert a virtual size ex: "0B (virtual 761MB)" to "0B"', ()=>{
        //Arrange
        const virtualSize = '12.421B (virtual 761MB)'
        //Act
        const result = containerVirtualSizeConverterToString(virtualSize); 
       //Assert
       const lastIndex = virtualSize.indexOf("(");
       const expectedResult = virtualSize.slice(0, lastIndex-1);
       expect(result).toBe(expectedResult); 
})

it('should throw an error if passed a parameter that is not a virtual size (virtual size ex: "0B (virtual 761MB)")', ()=>{
    //Arrange
    const virtualSize = '10B'
    //Act
    const resultFunction = () => {
        containerVirtualSizeConverterToString(virtualSize);
    }
    //Assert
    expect(resultFunction).toThrow(/Parameter is not a Virtual Size/)

})