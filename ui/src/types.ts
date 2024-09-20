//STATE TYPES
export type ImageType = {
    ID: string; 
    Repository: string;  
    Size:string;
    Tag: string; 
    CreatedSince?: string;
    Type?: string;
    Containers?: string; 
    CreatedAt?: string;  
    Digest?: string;  
    SharedSize?: string;
    UniqueSize?: string; 
    VirtualSize?: string; 
};

// type ImageType = Array<{
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
    ID: string;
    Size: string; 
    RunningFor: string; 
    State: string; 
    Names: string; 
    Image: string;

    Command?: string;
    CreatedAt?: string;
    Labels?: string; 
    LocalVolumes?: string; 
    Mounts?: string;
    Networks?: string;
    Ports?: string; 
    Status?: string; 
}

export type BuildCacheType = {
    CreatedSince:string;
    ID:string;
    Reclaimable:string;
    Size: string;
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
    dataGridBlueButtonType? : number;
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
