import express from 'express';
import controllerForUsers from '../controllers/userController.js';
 
const userRouter = express.Router();

// router.post('/', controllerForUsers.loginUser, (req, res) => {
//   res.status(200).json('Success!');
// });

userRouter.post('/registerUser', controllerForUsers.registerUser, (req, res) => {
  res.status(200).json('New User Added to DB!');
});

// router.post('/authUser', controllerForUsers.authUser, (req, res) => {
//   res.status(200).json('User Authorized!');
// });


// module.exports = router;
export default userRouter;