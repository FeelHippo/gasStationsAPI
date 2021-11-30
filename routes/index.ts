import * as express from 'express';
import Controller from '../controllers/index'

export const authentication = (app: express.Application) => {
  
  // verify whether user is registered
  app.get('/user/login/:user', Controller.verify);

  // create account
  app.post('/user/register', Controller.register);

  // authenticate existing account + initiate JWT token
  app.post('/user/login', Controller.login);
  app.get('/user/tokenIsValid', Controller.verifyToken);

}

export const gasStations = (app: express.Application) => {}