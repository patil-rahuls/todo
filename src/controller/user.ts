import { Router, Request, Response } from 'express';
import { Controller } from '../interfaces/controller.js';
import User from '../models/user.js';
import { userValidationMiddleware } from '../middleware/validation.js';
import asyncHandler from 'express-async-handler';
import { generateJwt } from '../config/jwt.js';

class UserController implements Controller {
  public path: string;
  public router: Router;

  constructor() {
    this.path = '/api/user';
    this.router = Router();
    this.initializeRoutes();
  }

  private createUser = asyncHandler(async (req: Request, res: Response) => {
    try{
      const { email, password } = req.body;
      if(await User.findOne({ email })){
        // User already exists.
        throw new Error(`EmailID already exists, Please login!`);
      } else {
        // new user
        if(await User.create({ email, password })){
          res.json({
            success: true,
            msg: `User signed up! Please login!`
          });
        }
      }
    } catch(err: any){
      throw new Error(`Error - ${err.message}`);
    }
  });

  private loginUser = asyncHandler(async (req: Request, res: Response) => {
    try{
      const { email, password } = req.body;
      const foundUser: any = await User.findOne({ email });
      if(!foundUser || !await foundUser.verifyPassword(password)){
        throw new Error(`Invalid Credentials !`);
      } else {
        // User exists and password is also correct.
        console.log(`User with id ${foundUser._id} login.`);
        res.json({
          // id: foundUser._id,
          // email: foundUser.email,
          token: generateJwt(foundUser._id)
        });
      }
    } catch(err: any){
      throw new Error(`Error - ${err.message}`);
    }
  });

  private initializeRoutes(){
    this.router.post('/signup', userValidationMiddleware, this.createUser);
    this.router.post('/login', userValidationMiddleware, this.loginUser);
  }
}

export { UserController };
