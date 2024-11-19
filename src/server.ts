import { App } from './app.js';
import { UserController } from './controller/user.js';
import { TodoController } from './controller/todo.js';

const controllerArr = [new UserController(), new TodoController()];
const app = new App(controllerArr);
app.start();
