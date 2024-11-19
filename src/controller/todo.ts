import { Controller } from '../interfaces/controller.js';
import { Router, Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { authnMiddleware } from "../middleware/authn.js";
import { todoValidationMiddleware, todoIdValidationMiddleware, todoUpdateValidationMiddleware } from '../middleware/validation.js';
import { Todo } from '../interfaces/todo.js';
import TodoModel from '../models/todo.js';
import { ObjectId } from 'mongodb';

class TodoController implements Controller{
  public path: string;
  public router: Router;  

  constructor() {
    this.path = '/api/user/todo'; // '/user/todo' because a todo belongs to user.
    this.router = Router();
    this.initializeRoutes();
  }

  private createTodo = asyncHandler(async (req: Request, res: Response) => {
    try{
      let { title, description, dueDate, completed = false }: Todo = req.body;
      title = title?.trim();
      description = description?.trim();
      dueDate = dueDate?.trim();
      if(await TodoModel.findOne({ title })){
        // Todo already exists.
        throw new Error(`A Todo with title '${title}' already exists. Try a differnt title.`);
      } else {
        // Create a new todo
        const userId = res.locals.userId; // get user id from res.locals obj
        const todoObj = { title, description, dueDate, completed, userId };
        const result = await TodoModel.create(todoObj);
        if(result?._id){
          // delete the userId from todoObj, so that the remaining obj can be passed in response.
          delete todoObj.userId;
          res.json({
            success: true,
            msg: `Todo item created successfully!`,
            data: todoObj // optional. we are returning this so that in future, the UI can be updated.(for Frontend)
          });
        }
      }
    } catch(err: any) {
      throw new Error(`Error - ${err.message}`);
    }
  });

  private getAllTodos = asyncHandler(async (req: Request, res: Response) => {
    try{
      const userId = res.locals.userId; // get user id from res.locals obj
      const allTodos = await TodoModel.find({ userId }, {
        title: true, description: true, dueDate: true, completed: true
      }, { projection: { __v: 0, userId: 0 } });
      let msg = `Todo items fetched successfully!`;
      if(!allTodos.length){
        throw new Error(`No Todo items found!`);
      }
      res.json({
        success: true,
        msg,
        data: allTodos
      });
    } catch(err: any) {
      throw new Error(`Error - ${err.message}`);
    }
  });

  private getTodo = asyncHandler(async (req: Request, res: Response) => {
    try{ 
      const todoId = req.params?.id;
      const userId = res.locals.userId; // get user id from res.locals obj
      const todo = await TodoModel.findOne({ userId, _id: new ObjectId(todoId) }, {
        title: true, description: true, dueDate: true, completed: true
      }, { projection: { _id: 0, __v: 0, userId: 0 } });
      let msg = `Todo item fetched successfully!`;
      if(!todo?.title){
        throw new Error(`Todo item not found!`);
      }
      res.json({
        success: true,
        msg,
        data: todo
      });
    } catch(err: any) {
      throw new Error(`Error - ${err.message}`);
    }
  });

  private deleteTodo = asyncHandler(async (req: Request, res: Response) => {
    try{ 
      const todoId = req.params?.id;
      const userId = res.locals.userId; // get user id from res.locals obj
      const result = await TodoModel.deleteOne({ userId, _id: new ObjectId(todoId) });
      let msg = `Todo item deleted successfully!`;
      if(!result?.deletedCount){
        throw new Error(`Todo item not found OR already deleted!`);
      }
      res.json({
        success: true,
        msg
      });
    } catch(err: any) {
      throw new Error(`Error - ${err.message}`);
    }
  });

  private updateTodo = asyncHandler(async (req: Request, res: Response) => {
    // Assuming that user can provide any or all of the fields for updating.
    try{
      const todoId = req.params?.id;
      const userId = res.locals.userId; // get user id from res.locals obj
      let { title='', description='', dueDate='', completed }: Todo = req.body;
      if(title){
        title = title?.trim();
      }
      if(description){
        description = description?.trim();
      }
      if(dueDate){
        dueDate = dueDate?.trim();
      }
      const updateObj = {
        ...(title && { title }),
        ...(description && { description }),
        ...(dueDate && { dueDate }),
        ...(typeof completed === 'boolean' && { completed }),
      };
      const result = await TodoModel.updateOne(
        { userId, _id: new ObjectId(todoId) },
        {$set: updateObj}
      );
      if(!result?.modifiedCount){
        throw new Error(`Todo item not/already updated!`);
      }
      res.json({
        success: true,
        msg: `Todo item updated successfully!`,
        data: updateObj // updated data. (optional for frontend)
      });
    } catch(err: any) {
      throw new Error(`Error - ${err.message}`);
    }
  });
  
  private initializeRoutes(){
    this.router.post('/add', authnMiddleware, todoValidationMiddleware, this.createTodo);
    this.router.get('/all', authnMiddleware, this.getAllTodos);
    this.router.get('/id/:id', authnMiddleware, todoIdValidationMiddleware, this.getTodo);
    this.router.delete('/id/:id', authnMiddleware, todoIdValidationMiddleware, this.deleteTodo);
    this.router.put('/id/:id', authnMiddleware, todoUpdateValidationMiddleware, this.updateTodo);
  }
}

export { TodoController };
