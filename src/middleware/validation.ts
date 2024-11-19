import asyncHandler from "express-async-handler";
import { User } from "../interfaces/user";
import { Todo } from "../interfaces/todo";
import validation from "validator";

// For request body validation we can also use joi,
// but by custom we can have more control over our validation.

// User login/sign up Request body validation - custom
const userValidationMiddleware = asyncHandler(async (req, res, next) => {
  let { email, password }: User = req.body;
  switch(true){
    // 1. Check if the fields are present in the body
    case Boolean(!email || !password):
      throw new Error(`Missing Email and/or Password`);
    // 2. Type validation. Only accept 'string' type.
    case Boolean(![email, password].every(ip => typeof ip === 'string')):
      throw new Error(`Email and Password should both be string`);
    // 3. Email vaidation - using 'validator' library
    case !validation.isEmail(email):
      throw new Error(`Incorrect Email`);
    // 4. Min 6, Max 20 alphanumeric characters validatoin for psswrd
    case password.length < 6 || password.length > 20 || !validation.isAlphanumeric(password):
      throw new Error(`Password should be between 6 to 20 alpha-numeric characters long.`);
  }
  next();
});

// Todo item Request body validation - custom
const todoValidationMiddleware = asyncHandler(async (req, res, next) => {
  let { title, description, dueDate, completed = false }: Todo = req.body;
  switch(true){
    // 1. Check if the fields are present in the body
    case Boolean(!title || !description || !dueDate):
      throw new Error(`Missing fields - Title OR Description OR dueDate`);
    // 2. Type validation. Only accept 'string' type for title, description and date.
    case Boolean(![title, description, dueDate].every(ip => typeof ip === 'string')):
      throw new Error(`Title, Description and dueDate all should be string`);
    // 3. Alphanumeric validation for title and description using 'validator' library
    case Boolean(!validation.isAlphanumeric(title) || !validation.isAlphanumeric(description)):
      throw new Error(`Only alphanumeric characters allowed for Title and Description`);
    // 4. Check if dueDate string is a date 
    case !validation.isDate(dueDate, { format: "MM/DD/YYYY" }):
      throw new Error(`dueDate should be a date string in format 'MM/DD/YYYY'`);
    // 5. completed
    case typeof completed !== 'boolean':
      throw new Error(`Field - 'completed' should be a boolean`);
  }
  next();
});

const todoIdValidationMiddleware = asyncHandler(async (req, res, next) => {
  let { id } = req.params;
  id = id?.trim(); // req.params are always in string.
  switch(true){
    // 1. Check if the todo id field is present in the body
    case Boolean(!id):
      throw new Error(`Missing query parameter`);
    // 2. Check if the todo id is a integer and not decimal or any other type.
    case Boolean(Number(id) % 1 !== 0 || id.includes('.')):
      throw new Error(`Query parameter should be an integer`);
  }
  next();
}); 

export { userValidationMiddleware, todoValidationMiddleware, todoIdValidationMiddleware };