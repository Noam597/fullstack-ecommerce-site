import { Router} from 'express'
import {signupController,
     loginController,
      registerController,
       makeNewToken,
        jwtTest,
         addUser,
          getAllUsers,
            testRedis,
            logoutController,
            loggedInUserController,
            
        } from '../controller/user.js';
import { authToken } from '../middleware/jwtAuth.js';
 
const signUpRouter = Router();



signUpRouter.get('/', signupController);
signUpRouter.post('/login', loginController);
signUpRouter.post('/register', registerController);
signUpRouter.post('/logout', logoutController)

//checks if the users token is in the cookie
signUpRouter.get('/getMe', authToken, loggedInUserController)

signUpRouter.post('/addUser', addUser);
signUpRouter.get('/getallusers', getAllUsers)
//token tester routes
signUpRouter.post('/token', makeNewToken)
signUpRouter.post('/authToken', authToken, jwtTest)

signUpRouter.get("/test-redis", testRedis);

// signUpRouter.post("/seed-users", seedUsersController);
 
export {signUpRouter};