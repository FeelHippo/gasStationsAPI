import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

export default (req: Request & jwt.JwtPayload, res: Response, next: NextFunction) => {
  
  const authHeader: string = req?.headers?.authorization;

  if (authHeader) {
    const token: string = authHeader.split(' ')[1];

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) return res.sendStatus(403);
      
      req.user = user;
      next();
    })
  } else {
    res.sendStatus(401);
  }
}