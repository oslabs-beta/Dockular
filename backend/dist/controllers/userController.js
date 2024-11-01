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
const controllerForUsers = {};
controllerForUsers.loginUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { user_name, password } = req.body;
    console.log("entered loginUser middleware");
    console.log("loginUser controller password -->", password);
    console.log("loginUser controller req.body -->", req.body);
    return next();
});
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
    }
});
controllerForUsers.authUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { user_name, password } = req.body;
        console.log("entered authUser middleware");
        console.log("addUser controller req.body -->", req.body);
        const user = yield User.findOne({ user_name });
        if (password === user.password) {
            // res.locals.user = user;
            return next();
        }
        else {
            throw Error("Please check credentials and try again");
        }
    }
    catch (err) {
        console.log(err);
    }
});
// module.exports = controllerForUsers;
export default controllerForUsers;
