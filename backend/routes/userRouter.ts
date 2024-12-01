import express, {Request, Response} from 'express';
import controllerForUsers from '../controllers/userController.js';
 
const userRouter:any = express.Router();

// router.post('/', controllerForUsers.loginUser, (req, res) => {
//   res.status(200).json('Success!');
// });

userRouter.get("/get-user/:cognitoId", controllerForUsers.getUser, (req:Request, res:Response) => {
  res.status(200).json(res.locals.specificUser);
});

userRouter.post('/create-user', controllerForUsers.createUser, (req:Request, res:Response) => {
  res.status(200).json(res.locals.newUser);
});

userRouter.post('/registerUser', controllerForUsers.registerUser, (req:any, res:any) => {
  res.status(200).json('New User Added to DB!');
});

// router.post('/authUser', controllerForUsers.authUser, (req, res) => {
//   res.status(200).json('User Authorized!');
// });


// module.exports = router;
export default userRouter;