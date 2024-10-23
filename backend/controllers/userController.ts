import User from "../models/userModel";
 
const controllerForUsers:any = {};

controllerForUsers.loginUser = async (req:any, res:any, next:any) => {
  const { user_name, password } = req.body;
  console.log("entered loginUser middleware");
  console.log("loginUser controller password -->", password);
  console.log("loginUser controller req.body -->", req.body);
  return next();
};


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
  }
};

controllerForUsers.authUser = async (req:any, res:any, next:any) => {
    try {
      const { user_name, password } = req.body;
      console.log("entered authUser middleware");
      console.log("addUser controller req.body -->", req.body);
      const user:any = await User.findOne({ user_name });
      if (password === user.password) {
        // res.locals.user = user;
        return next();
      } else {
        throw Error("Please check credentials and try again");
      }
    } catch (err) {
      console.log(err);
    }
  };

 
  // module.exports = controllerForUsers;
  export default controllerForUsers;
