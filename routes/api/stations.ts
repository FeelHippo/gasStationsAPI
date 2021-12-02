import * as express from 'express';
import { StationController } from '../controllers/index';
import authenticateJWT from '../../utils/authenticateJWT';

export default (app: express.Application) => {

  // return geoLocation data
  app.get('/api/allStations', StationController.getAllStations);

  // create new station
  app.post('/api/postStation', authenticateJWT, StationController.postStation);

  // update existing station
  app.put('/api/updateStation', authenticateJWT, StationController.updateStation);

  // delete station
  app.delete('/api/deleteStation/:id', authenticateJWT, StationController.deleteStation);
}