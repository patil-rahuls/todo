import './config/dotenv.js';
import express from "express";
import bodyParser from 'body-parser';
import { dbConn } from './config/db.js';
// Interfaces
import { Controller } from './interfaces/controller.js';
// Error middlewares
import { notFound, errorHandler } from './middleware/errorHandler.js';

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
    this.app
      .listen(this.PORT, () => {
        console.info(`Server started on PORT - ${this.PORT}`);
      })
      .on('error', err => {
        if (err.message.includes('EADDRINUSE')) {
          console.error(`PORT-${this.PORT} already in use. Please Free the port OR re-configure the server to use a different port and restart the App.`);
        }
      });
  }
}

export { App };
