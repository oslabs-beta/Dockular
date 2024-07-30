import { it, expect } from "vitest";
import { storageNumToStr } from "../prune/utilities/StorageNumtoStr";

it('should convert a number greater than a thousand into a GB', () => {
    //arrange
    const number = 1235;
    //act
    const result = '1.24GB'
    //asert
    const expectedResult = storageNumToStr(number); 
    expect(result).toBe(expectedResult);
})

it('should convert a number greater than 1 and less than a thousand into a MB', ()=>{
    //arrange
    const number = 125;
    //act
    const result = '125MB'
    //asert
    const expectedResult = storageNumToStr(number); 
    expect(result).toBe(expectedResult); 
})

it('should convert a number less than one into a kilobyte', ()=>{
    //arrange
    const number = 0.475
    //act
    const result = '475KB'
    //asert
    const expectedResult = storageNumToStr(number); 
    expect(result).toBe(expectedResult);
})

