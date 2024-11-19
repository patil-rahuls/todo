import { Controller } from '../interfaces/controller.js';
import { Router } from 'express';
import { authnMiddleware } from "../middleware/authn.js";

// WIP - to be done in next commit.
// Only protected the routes for this commit.

class TodoController implements Controller{
  public path: string;
  public router: Router;  

  constructor(){
    this.path = '/api/user/todo'; // '/user/todo' because todo list belongs to user.
    this.router = Router();
    this.initializeRoutes();
  }
  
  private initializeRoutes(){
    this.router.post('/add', authnMiddleware); // Create WIP
    this.router.get('/all', authnMiddleware); // Read WIP
    this.router.get('/:id', authnMiddleware); // Read WIP
    this.router.delete('/:id', authnMiddleware); // Delete WIP
    this.router.put('/:id', authnMiddleware); // Update WIP  
  }
}

export { TodoController };
