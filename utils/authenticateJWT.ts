import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

interface TokenRequest extends Request, jwt.JwtPayload {}

export default (req: TokenRequest, res: Response, next: NextFunction) => {
  
  const authHeader: string = req?.headers?.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1];

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) return res.sendStatus(403);
      
      req.user = user;
      next();
    })
  } else {
    res.sendStatus(401);
  }
}