import { Router } from 'express';
import { Controller } from '../interfaces/controller.js';
import User from '../models/user.js';
import validator from 'validator';
import asyncHandler from 'express-async-handler';
import { generateJwt } from '../config/jwt.js';

class UserController implements Controller{
  public path: string;
  public router: Router;

  constructor() {
    this.path = '/api/user';
    this.router = Router();
    this.initializeRoutes();
  }

  private validateInputs = (requestBody: any) => {
    const { email, password } = requestBody;
    switch(true){
      case Boolean(!email || !password):
        throw new Error(`Missing email and/or password`);
      // type validation. user/cleint can send anything - true, 0, null.
      case Boolean(![email, password].every(ip => typeof ip === 'string')):
        throw new Error(`Email and password both should be string`);
      // email vaidation
      case !validator.isEmail(email):
        throw new Error(`Incorrect email`);
      // min 6 characters validatoin for psswrd
      case password.length < 6:
        throw new Error(`Password should be at least 6 digits.`);
    }
    return { email, password };
  }

  public createUser = asyncHandler(async (req, res) => {
    const { email, password } = this.validateInputs(req.body);
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
  });

  public loginUser = asyncHandler(async(req, res) => {
    const { email, password } = this.validateInputs(req.body);
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
  });

  private initializeRoutes(){
    this.router.post('/signup', (req, res, next) => this.createUser(req, res, next));
    this.router.post('/login', (req, res, next) => this.loginUser(req, res, next));
  }
}

export { UserController };
