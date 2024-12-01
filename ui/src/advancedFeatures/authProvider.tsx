import React from "react";
import { Authenticator } from "@aws-amplify/ui-react";
import { Amplify } from "aws-amplify";
import "@aws-amplify/ui-react/styles.css";
import { createDockerDesktopClient } from '@docker/extension-api-client';
import { UserSignedIn } from "./UserSignedIn";


//Docker Desktop Client
const client = createDockerDesktopClient();
function useDockerDesktopClient() {
  return client;
}


Amplify.configure({
    Auth: {
        Cognito: {
            userPoolId: import.meta.env.VITE_PUBLIC_COGNITO_USER_POOL_ID || "",
            userPoolClientId: import.meta.env.VITE_PUBLIC_COGNITO_USER_POOL_CLIENT_ID || "",
        }
    }
})


const AuthProvider =  ({children}:any) => {

    return ( 

        <Authenticator signUpAttributes={['email']}>
        <UserSignedIn></UserSignedIn>
        </Authenticator>
   
    )
}

export default AuthProvider; 