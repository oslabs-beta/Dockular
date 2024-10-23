"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = __importDefault(require("../controllers/userController"));
const userRouter = express_1.default.Router();
// router.post('/', controllerForUsers.loginUser, (req, res) => {
//   res.status(200).json('Success!');
// });
userRouter.post('/registerUser', userController_1.default.registerUser, (req, res) => {
    res.status(200).json('New User Added to DB!');
});
// router.post('/authUser', controllerForUsers.authUser, (req, res) => {
//   res.status(200).json('User Authorized!');
// });
// module.exports = router;
exports.default = userRouter;
