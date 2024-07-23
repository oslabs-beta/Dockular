import {it, expect} from 'vitest';
import { stringToNumConverter } from '../prune/utilities/StringToNumConverter';

it('should convert size of Image/Container from a string to a number', ()=>{

   //Arange 
   const size = '10.98MB'
   
   //Act
   const result = stringToNumConverter(size);

   //Assert
   const expectedResult =  Number(size.slice(0, size.length-2));

   expect(result).toBe(expectedResult)
})
