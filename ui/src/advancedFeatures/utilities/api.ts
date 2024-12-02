import { getCurrentUser } from 'aws-amplify/auth';
import { fetchAuthSession } from 'aws-amplify/auth';

//this is a way for us to grab information from cognito. We can get the JWT tokens the access tokens, etc..
//by using this endpoint.

export async function cognitoUserSessionInfo() {

    try {
        const user = await getCurrentUser();
        const session = await fetchAuthSession();
        if(!session) throw new Error("No session found");
        const { userSub } = session; //cognitoId
        const { accessToken } = session.tokens ?? {};
        return {data: {user, session, userSub, accessToken}};
    } catch (error:any){
        return {error: error.message || "Could not fetch user data"}
    }
}

