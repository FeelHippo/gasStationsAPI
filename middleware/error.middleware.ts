import { NextFunction, Request, Response } from "express";
import HttpException from '../exceptions/HttpException';

export default function (error: HttpException, request: Request, response: Response, next: NextFunction) {
  const status = error.status || 500;
  const message = error.message || 'Something went wrong';
  console.log('ERROR!');
  
  response
    .status(status)
    .send({
      message,
      status,
    });
}