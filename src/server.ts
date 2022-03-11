import express, { Application } from 'express';
import errorMiddleware from '../middleware/error.middleware';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import cors from 'cors';

class App {
  public app: Application;

  constructor() {
    this.app = express();

    this.connectToMongo();
    this.initMiddleware();
    this.initControllers();
    this.initErrorHandler();
  }

  public listen() {
    const port: number = +process.env.PORT || 5000;
    this.app.listen(port, () => console.log(`App listening on port ${port}`));
  }

  public getServer() {
    return this.app;
  }

  private connectToMongo() {
    mongoose.connect(process.env.MONGODB || 'mongodb://localhost:27017/gasStations', async err => {
      if (err) throw err;
      console.log('Connected to MongoDb');
    });   
  }

  private initMiddleware() {
    this.app.use(cors());
    this.app.use(helmet());
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
  }

  private async initControllers() {
    const { AuthenticationRoutes, StationRoutes } = await import('../routes/index');
    new AuthenticationRoutes(this.app);
    new StationRoutes(this.app);
  }

  private initErrorHandler() {
    this.app.use(errorMiddleware)
  }
}

export default App;