import { Application } from 'express';
import Route from '../../interfaces/route';
import { StationController } from '../controllers/index';
import authenticateJWT from '../../utils/authenticateJWT';

export default class StationRoutes implements Route {
  public path = '/api';
  public app;

  constructor(app: Application) {
    this.app = app;

    this.initRoutes();
  }

  private initRoutes() {
    this.app
      .get(`${this.path}/allStations`, StationController.getAllStations)
      .post(`${this.path}/postStation`, authenticateJWT, StationController.postStation)
      .put(`${this.path}/updateStation`, authenticateJWT, StationController.updateStation)
      .delete(`${this.path}/deleteStation/:id`, authenticateJWT, StationController.deleteStation);
  }
}