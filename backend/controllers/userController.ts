import User from "../models/userModel.js";
import axios from 'axios';

const controllerForUsers:any = {};


/*We are going to create a request to get a specific user from our rds database.*/
controllerForUsers.getUser = async (req:any, res:any, next:any) => {
  try {
    const { cognito_id } = req.body;
    await axios.post(process.env.API_URL_GET_SPECIFIC_USER_REQUEST || "", {cognito_id})
     .then((response:any) => {
       const result = response.data.body;
       res.locals.specificUser = result;
       return next();
     })
    .catch(error => {
       console.log(`Error in axios GET request: ${error}`)
     });
  } catch (err:any) {
    next(`Error retrieving user: ${err.message}`)
  }
}


///////////////////////////////////////////////////////////////////////////////////////////////////////////////

controllerForUsers.createUser = async (req:any, res:any, next:any) => {

  try {
    const {
      username,
      cognitoId
    } = req.body;

    const userData = {
      user_name: username,
      cognito_id: cognitoId
    }

   await axios.post(process.env.API_URL_CREATE_USER_POST_REQUEST || "", userData)
    .then((response:any) => {
      
      res.locals.newUser = response;
      return next();

     })
      .catch(error => {
      // Handle errors
     console.log(`Error in axios POST request: ${error}`)
  });

  } catch (err:any) {
    next(`Error creating user: ${err.message}`)
  }
 
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////

controllerForUsers.registerUser = async (req:any, res:any, next:any) => {

  // console.log('REQ.BODY in userController file', req.body)

  try {
    const { user_name, password } = req.body;
    console.log("entered registerUser middleware", user_name);
    console.log("addUser controller req.body -->", req.body);
    const newUser = await User.create({
      user_name,
      password,
    });
    res.locals.newUser = newUser;
    return next();
  } catch (err) {
    console.log(err);
    next(`ERROR within userController: ${err}`);
  }
};


controllerForUsers.loginUser = async (req:any, res:any, next:any) => {
  const { user_name, password } = req.body;
  console.log("entered loginUser middleware");
  console.log("loginUser controller password -->", password);
  console.log("loginUser controller req.body -->", req.body);
  return next();
};

  // module.exports = controllerForUsers;
  export default controllerForUsers;
