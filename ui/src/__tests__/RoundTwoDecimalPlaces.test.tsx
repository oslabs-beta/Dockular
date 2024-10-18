import { it, expect } from "vitest";
import { roundTwoDecimalPlaces } from "../prune/utilities/RoundTwoDecimalPlaces";

it('should convert a number to a maximum of two decimal places',()=>{
    //Arrange
    const number = 10.58501;
    //Act
    const result = roundTwoDecimalPlaces(number);
    //Assert
    const expectedResult = Number.parseFloat(number.toFixed(2));
    expect(result).toBe(expectedResult);
})
