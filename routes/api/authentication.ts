import { Application } from 'express';
import Route from '../../interfaces/route';
import { AuthController } from '../controllers/index';

export default class AuthenticationRoutes implements Route {
  public path = '/user';
  public app;

  constructor(app: Application) {
    this.app = app;

    this.initRoutes();
  }

  private initRoutes() {
    this.app
      .get(`${this.path}/login/:user`, AuthController.verify)
      .post(`${this.path}/register`, AuthController.register)
      .post(`${this.path}/login`, AuthController.login)
      .get(`${this.path}/tokenIsValid`, AuthController.verifyToken);
  }
}