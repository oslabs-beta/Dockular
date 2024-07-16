import {it, expect} from 'vitest';
import { stringToNumConverter } from '../prune/utilities/StringToNumConverter';

it('should convert size of Image/Container from a string to a number', ()=>{
   const result = stringToNumConverter('10.98MB');
   expect(result).toBe(10.98)
})
