import React from "react";
import { Box } from "@mui/system";
import { Authenticator } from "@aws-amplify/ui-react";
import { Amplify } from "aws-amplify";
import "@aws-amplify/ui-react/styles.css";
import { Typography } from "@mui/material";
import { Button } from "@mui/material";

Amplify.configure({
    Auth: {
        Cognito: {
            userPoolId: import.meta.env.VITE_PUBLIC_COGNITO_USER_POOL_ID || "",
            userPoolClientId: import.meta.env.VITE_PUBLIC_COGNITO_USER_POOL_CLIENT_ID || "",
        }
    }
})

const formFields:any = {
    signup: {
        username: { 
            order:1,
            placeholder: "Choose a username",
            label: "Username",
            inputProps: {required: true}
        },
        email: { 
            order:2,
            placeholder: "Enter your email address",
            label: "Email",
            inputProps: {type:'email', required: true}
        },
        password: { 
            order:3,
            placeholder: "Enter your password",
            label: "Password",
            inputProps: {type:'password', required: true}
        },
        confirm_password: { 
            order:4,
            placeholder: "Confirm your password",
            label: "Confirm Password",
            inputProps: {type:'password', required: true}
        },
    },
}

const AuthProvider = ({children}:any) => {
    return ( 

        <Authenticator signUpAttributes={['email']}>{
            // ({user})=> user ? (<Box>{children}</Box>) : <Box> Please Sign in Below:</Box>
            ({ signOut, user }) => (
                <Box>
                  <Typography component="h1">{user?.username}</Typography>
                  <Button onClick={signOut}>Sign out</Button>
                </Box>
              )}

        </Authenticator>
   
    )
}

export default AuthProvider; 