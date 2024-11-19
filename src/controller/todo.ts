import { Controller } from '../interfaces/controller.js';
import { Router, Request, Response } from 'express';
import { authnMiddleware } from "../middleware/authn.js";
import { todoValidationMiddleware, todoIdValidationMiddleware } from '../middleware/validation.js';

// Developed and tested till request body validations.
// WIP - CRUD operatiosn to be developed in next commit.

class TodoController implements Controller{
  public path: string;
  public router: Router;  

  constructor() {
    this.path = '/api/user/todo'; // '/user/todo' because a todo belongs to user.
    this.router = Router();
    this.initializeRoutes();
  }
  
  private initializeRoutes(){
    this.router.post('/add', authnMiddleware, todoValidationMiddleware, this.createTodo);
    this.router.get('/all', authnMiddleware, this.getAllTodos);
    this.router.get('/id/:id', authnMiddleware, todoIdValidationMiddleware, this.getTodo);
    this.router.delete('/id/:id', authnMiddleware, todoIdValidationMiddleware, this.deleteTodo);
    this.router.put('/id/:id', authnMiddleware, todoIdValidationMiddleware, this.updateTodo);
  }

  private createTodo(req: Request, res: Response){
    // Create
    res.json({
      success: true,
      msg: `Validation Tested successfully`
    });
  }
  
  private getAllTodos(req: Request, res: Response){
    // Get all todos
    res.json({
      success: true,
      msg: `Validation Tested successfully`
    });
  }

  private getTodo(req: Request, res: Response){
    // Get todo by id
    const todoId = req.params.id;
    res.json({
      success: true,
      msg: `Validation Tested successfully`
    });
  }

  private deleteTodo(req: Request, res: Response){
    // Delete todo by id
    const todoId = req.params.id;
    res.json({
      success: true,
      msg: `Validation Tested successfully`
    });
  }

  private updateTodo(req: Request, res: Response){
    // Update todo by id
    const todoId = req.params.id;
    res.json({
      success: true,
      msg: `Validation Tested successfully`
    });
  }
}

export { TodoController };
