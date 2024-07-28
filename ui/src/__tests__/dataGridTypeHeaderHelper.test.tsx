import { it, expect } from "vitest";
import { dataGridTypeHeaderHelper } from '../prune/modules/dataGridTypeHeaderHelper'; 

it('should convert the dataGridButtonType string with a hyphen to a string without hyphen and make first letters uppercase', () => {

    const types = [
        'exited-containers',
        'paused-containers',
        'running-containers',
        'dangling-images',
        'in-use-images',
        'unused-images',
        'built-casche',
        'built-casch',
    ];
    
    //Arrange
     const getTypesIndex = (typesLength:number) => {
        return Math.floor(Math.random() * typesLength);
    }
    const index = getTypesIndex(types.length); 
    // const buttonSelectedType:any = 'built-casch'
    const buttonSelectedType = types[index];

    //Act
    const result = dataGridTypeHeaderHelper(buttonSelectedType); 

    //Assert
    //we set it to invalid off the bat because otherwise it will result in undefined... which will be the same as result on line 26 above. 
    let expectedResult = 'invalid';

    if(buttonSelectedType === 'exited-containers') {  
        expectedResult = 'Exited Containers'
    } else if (buttonSelectedType === 'paused-containers') {
        expectedResult = 'Paused Containers'
    } else if (buttonSelectedType === 'running-containers') {
        expectedResult = 'Running Containers'
    } else if (buttonSelectedType === 'dangling-images'){
        expectedResult = 'Dangling Images'
    }  else if (buttonSelectedType === 'in-use-images'){
        expectedResult = 'In Use Images'
    } else if (buttonSelectedType === 'unused-images'){
        expectedResult = 'Unused Images'
    } else if (buttonSelectedType ===  'built-casche'){
        expectedResult =  'Build Cache - Beta'
    } 

        expect(result).toBe(expectedResult)

});