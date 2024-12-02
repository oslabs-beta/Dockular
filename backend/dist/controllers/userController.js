var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import User from "../models/userModel.js";
import axios from 'axios';
const controllerForUsers = {};
/*We are going to create a request to get a specific user from our rds database.*/
controllerForUsers.getUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { cognito_id } = req.body;
        yield axios.post(process.env.API_URL_GET_SPECIFIC_USER_REQUEST || "", { cognito_id })
            .then((response) => {
            const result = response.data.body;
            res.locals.specificUser = result;
            return next();
        })
            .catch(error => {
            // Handle errors
            console.log(`Error in axios GET request: ${error}`);
        });
    }
    catch (err) {
        next(`Error retrieving user: ${err.message}`);
    }
});
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
controllerForUsers.createUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, cognitoId } = req.body;
        const userData = {
            user_name: username,
            cognito_id: cognitoId
        };
        yield axios.post(process.env.API_URL_CREATE_USER_POST_REQUEST || "", userData)
            .then((response) => {
            res.locals.newUser = response;
            return next();
        })
            .catch(error => {
            // Handle errors
            console.log(`Error in axios POST request: ${error}`);
        });
    }
    catch (err) {
        next(`Error creating user: ${err.message}`);
    }
});
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
controllerForUsers.registerUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log('REQ.BODY in userController file', req.body)
    try {
        const { user_name, password } = req.body;
        console.log("entered registerUser middleware", user_name);
        console.log("addUser controller req.body -->", req.body);
        const newUser = yield User.create({
            user_name,
            password,
        });
        res.locals.newUser = newUser;
        return next();
    }
    catch (err) {
        console.log(err);
        next(`ERROR within userController: ${err}`);
    }
});
controllerForUsers.loginUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { user_name, password } = req.body;
    console.log("entered loginUser middleware");
    console.log("loginUser controller password -->", password);
    console.log("loginUser controller req.body -->", req.body);
    return next();
});
// module.exports = controllerForUsers;
export default controllerForUsers;
