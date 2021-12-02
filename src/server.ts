import express, { Express } from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import cors from 'cors';

const app = async () => {
  
  const app: Express = express();
  mongoose.connect(process.env.MONGODB || 'mongodb://localhost:27017/gasStations', async err => {
    if (err) throw err;
    console.log('Connected to MongoDb');
  })
  
  const PORT = process.env.PORT || 3000;
  
  // middleware
  app.use(cors());
  app.use(helmet());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  
  // instantiate routes
  const { authentication, gasStations } = await import('../routes/index');
  authentication(app);
  gasStations(app);

  // invalid routes
  app.get('*', (_, res) => res.status(404).send('Not Found'));
  
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });

}

export default app;