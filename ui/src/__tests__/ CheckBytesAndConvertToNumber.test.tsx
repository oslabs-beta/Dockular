import { it, expect } from "vitest";
import { checkBytesAndConvertToNumber } from '../prune/utilities/ CheckBytesAndConvertToNumber'

it('should convert container size of kB to MB. First convert to number and divide the number by 1000', ()=>{
    //Arange 
    const size = '37.6kB'
    //Act
    const result =  Number(size.slice(0, size.length-2))/1000;
    //Assert
    const expectedResult = checkBytesAndConvertToNumber(size)
    expect(result).toBe(expectedResult);
})

it('should container container size of MB to a number)', ()=>{
    //Arange 
    const size = '1.02MB'
    //Act
    const result = Number(size.slice(0, size.length-2))
    //Assert
    const expectedResult = checkBytesAndConvertToNumber(size)
    expect(result).toBe(expectedResult);

})

it('should convert container size of GB to MB. First convert to number and Multiple the number by 1000', ()=>{
    //Arange 
    const size = '3GB'
    //Act
    const result = Number(size.slice(0, size.length-2))*1000;
    //Assert
    const expectedResult = checkBytesAndConvertToNumber(size)
    expect(result).toBe(expectedResult); 
})