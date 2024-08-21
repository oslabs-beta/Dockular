import { it, expect, describe } from "vitest";
import { rowColumnTypeHelper } from "../prune/modules/GetAllStorage/rowColumnTypeHelper";

it('should return a string', ()=> { 
    //ARRANGE
    const buttonType = 'dangling-images';
    const rowOrCol = 'col';
    const field = 'TagOrName';
    //IMAGES
    const typeElementImages = {
        CreatedSince: "2 hours ago",
        ID: "08aad29bd650",
        Repository: "<none>",
        Size: "15.6MB",
        Tag:"<none>",
        Type: "Image"
    };
    
    //CONTAINERS
    // const typeElementContainers = {
    //     ID: "f6022c146c6a",
    //     Image: "elasticsearch:8.15.0",
    //     Names: "wizardly_albattani",
    //     RunningFor: "14 seconds ago",
    //     Size: "109kB (virtual 816MB)",
    //     State: "running"
    // }

    //ACT
    const result = rowColumnTypeHelper(buttonType,rowOrCol,field,typeElementImages);

    //ASSERT
    expect(result).toBeTypeOf('string');

});