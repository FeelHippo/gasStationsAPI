import express, { Express, Request, Response } from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { authentication, gasStations } from '../routes/index'

const app: Express = express();
dotenv.config();
mongoose.connect(process.env.MONGODB || 'mongodb://localhost:27017/gasStations', console.log)

const PORT = process.env.PORT || 3000;

// middleware
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// instantiate routes
authentication(app);
gasStations(app);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
