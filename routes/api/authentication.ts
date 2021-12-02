import * as express from 'express';
import { AuthController } from '../controllers/index';

export default (app: express.Application) => {
  
  // verify whether user is registered
  app.get('/user/login/:user', AuthController.verify);

  // create account
  app.post('/user/register', AuthController.register);

  // authenticate existing account + initiate JWT token
  app.post('/user/login', AuthController.login);
  app.get('/user/tokenIsValid', AuthController.verifyToken);

}