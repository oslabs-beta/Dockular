import { createDockerDesktopClient } from '@docker/extension-api-client';

//This function is used to help us create exited containers after they have been paused as test cases to prune.




const client = createDockerDesktopClient();
function useDockerDesktopClient() {
  return client;
}

export async function containerTestCreator() {
    const ddClient = useDockerDesktopClient();
    for(let i = 0; i <= 2; i++){
        // await ddClient.docker.cli.exec('create', ['--name', `testElasticSearch${i}`, 'f32f9a1115a4c445a92e405796c2dd1c95e5425167dbaf62a7cf233a2ac7e81b'])
        // // '--all', '--format', '"{{json .}}"', '--filter', "status=exited", '--filter', "status=paused", '--filter', "status=created"
        // .then((res)=>{console.log('run', res)})
        
        // await ddClient.docker.cli.exec('pause', [`testElasticSearch${i}`])
        // .then((res)=>{console.log('pause', res)})

        // await ddClient.docker.cli.exec('stop', [`testElasticSearch${i}`])
        // .then((res)=>{console.log('stop', res)})

        
    }
}