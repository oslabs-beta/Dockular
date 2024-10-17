import { createDockerDesktopClient } from '@docker/extension-api-client';
import { useState } from 'react';
import { Stack, TextField, Typography } from '@mui/material';
import Button from '@mui/material/Button';


//Docker Desktop Client
const client = createDockerDesktopClient();
function useDockerDesktopClient() {
  return client;
}

export function BackendTest() {

    const [response,setResponse] = useState<string>();

    const ddClient = useDockerDesktopClient();
  
    const fetchAndDisplayResponse = async () => {
      console.log('fetchAndDisplayResponse')
      const result = await ddClient.extension.vm?.service?.get("/hello");
      console.log('result', result)
      setResponse(JSON.stringify(result));
    }


  return (
    <>
     <Typography variant="h3">Docker extension demo</Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
        This is a basic page rendered with MUI, using Docker's theme. Read the
        MUI documentation to learn more. Using MUI in a conventional way and
        avoiding custom styling will help make sure your extension continues to
        look great as Docker's theme evolves.
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
        Pressing the below button will trigger a request to the backend. Its
        response will appear in the textarea.
      </Typography>
      <Stack direction="row" alignItems="start" spacing={2} sx={{ mt: 4 }}>
        <Button variant="contained" onClick={fetchAndDisplayResponse}>
          Call backend
        </Button>

        <TextField
          label="Backend response"
          sx={{ width: 480 }}
          disabled
          multiline
          variant="outlined"
          minRows={5}
          value={response ?? ''}
        />
      </Stack>
        
    </>
  );
} 


