//STATE TYPES
export type ImageType = {
    CreatedSince: string;
    ID: string; 
    Repository: string;  
    Size:string;
    Tag: string; 
    Type?: string;
    Containers?: string; 
    CreatedAt?: string;  
    Digest?: string;  
    SharedSize?: string;
    UniqueSize?: string; 
    VirtualSize?: string; 
};


// type GridRowsDataType = Array<{
//    CreatedSince: string;
    // ID: String; 
    // Repository: string;  
    // Size:string;
    // Tag: string; 
    // Type?: string;
    // Containers?: string; 
    // CreatedAt?: string;  
    // Digest?: string;  
    // SharedSize?: string;
    // UniqueSize?: string; 
    // VirtualSize?: string; 
// }>;

export type ContainerType = {
    Command: string;
    CreatedAt: string;
    ID: string;
    Image: string;
    Labels: string; 
    LocalVolumes: string; 
    Mounts: string;
    Names: string; 
    Networks: string;
    Ports: string; 
    RunningFor: string; 
    Size: string; 
    State: string; 
    Status: string; 
  }

export type StorageSizeType = {
    "running-containers": {[key:string]: number};
    'exited-containers': {[key:string]: number};
    'paused-containers': {[key:string]: number};
    'dangling-images': {[key:string]: number};
    'in-use-images': {[key:string]: number};
    'unused-images': {[key:string]: number};
    'built-casche': {[key:string]: number};
};


export type SelectedRowSizeType = {
    'running-containers': number,
    'exited-containers': number, 
    'paused-containers': number,
    'dangling-images': number, 
    'in-use-images': number,
    'unused-images': number,
    'built-casche': number,
    'selectedTotal': number, 
}

export type TotalStorageType = {
    'running-containers': number,
    'exited-containers': number, 
    'paused-containers': number,
    'dangling-images': number, 
    'in-use-images': number,
    'unused-images': number,
    'built-casche': number,
    'combinedTotal': number
}

export type AllImageAndContainerStorageType = {
    'all-images': number, 
    'all-containers': number
}
