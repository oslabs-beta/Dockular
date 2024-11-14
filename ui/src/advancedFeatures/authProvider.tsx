import React from "react";
import { Box } from "@mui/system";
import { Authenticator } from "@aws-amplify/ui-react";
import { Amplify } from "aws-amplify";
import "@aws-amplify/ui-react/styles.css";

 

Amplify.configure({
    Auth: {
        Cognito: {
            userPoolId: import.meta.env.VITE_PUBLIC_COGNITO_USER_POOL_ID || "",
            userPoolClientId: import.meta.env.VITE_PUBLIC_COGNITO_USER_POOL_CLIENT_ID || "",
        }
    }
})

const AuthProvider = ({children}:any) => {
    return (<Box>
        <Authenticator>{({user})=> 
            user ? (
                <Box>{children}</Box>
            ) : 
            <Box> Please Sign in Below:</Box>
        }</Authenticator>
    </Box>
    )
}

export default AuthProvider; 