import * as express from 'express';
import { StationController } from '../controllers/index';

export default (app: express.Application) => {

  // return geoLocation data
  app.get('/api/allStations', StationController.getAllStations);

  // create new station
  app.post('/api/postStation', StationController.postStation);

  // update existing station
  app.put('/api/updateStation', StationController.updateStation);

  // delete station
  app.delete('/api/deleteStation/:id', StationController.deleteStation);
}