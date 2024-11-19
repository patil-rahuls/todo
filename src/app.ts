import './config/dotenv.js';
import express from "express";
import bodyParser from 'body-parser';
import { dbConn } from './config/db.js';
// Interfaces
import { Controller } from './interfaces/controller.js';
// Error middlewares
import { notFound, errorHandler } from './middleware/errorHandler.js';
import cron from 'node-cron';
import TodoModel from './models/todo.js';

class App {
  public app: express.Application;
  private PORT: number | string = process.env.PORT || 9969;

  constructor(controllers: Controller[]) {
    this.app = express();
    this.initializeMiddlewares();
    this.initializeControllers(controllers);
    this.initializeErrorHandling();
  }
  
  private initializeMiddlewares() {
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: false }));
  }

  // Routes
  private initializeControllers(controllers: Controller[]) {
    controllers.forEach(controller => {
      this.app.use(controller.path, controller.router);
    });
  }
  
  // Error handler middlewares
  private initializeErrorHandling(){
    this.app.use(notFound);
    this.app.use(errorHandler);
  }

  public start() {
    dbConn();
    this.app.set('json spaces', 2);// just to make our response look more readable
    // Start server
    this.app
      .listen(this.PORT, () => {
        console.info(`Server started on PORT - ${this.PORT}`);
      })
      .on('error', err => {
        if (err.message.includes('EADDRINUSE')) {
          console.error(`PORT-${this.PORT} already in use. Please Free the port OR re-configure the server to use a different port and restart the App.`);
        }
      });
    // Start cron to mark expired todo items compelted: true
    this.setExpiredTodoCompletedCron();
  }

  // Cron job to run every midnight 12:00 AM and mark all expired todos irrespective of users.
  private setExpiredTodoCompletedCron() {
    cron.schedule("0 0 0 * * *", async function() {
      try {
        const now = new Date();
        console.log(`Cron started at ${now}!`);
        // first find expired todo items having completed: false for logging before marking them complete.
        const todos = await TodoModel.find({
          "$expr": {"$and": [
            {"$lt": [{ "$dateFromString": { "dateString": "$dueDate" }}, now ]},
            {"$eq":["$completed", false] }
          ]}
        });
        // console.log(todos);
        if(todos.length) {
          const ids: any = todos.map(td => td._id);
          const result = await TodoModel.updateMany({ _id: { $in: ids } }, {$set: {completed: true}});
          if(result.modifiedCount === todos.length){
            todos.forEach(td => console.log(`Todo item - '${td.title}' id-'${td._id}' marked completed.`));
          } else {
            console.log(`One or more Todo items were not marked completed.`);
          }
        } else {
          console.log(`No Todo items currently expired.`);
        }
        console.log(`Cron Finished at ${new Date()}!`);
      } catch(err: any){
        console.error(`Cron Error - ${err.message}`);
      }
    });
  }
}

export { App };
