
import { Request, Response } from 'express';
import validator from 'validator';

export default (username: string, password: string, res: Response) => {

  if(
    !validator.isAlphanumeric(username)
    || validator.isEmpty(username)
    || !validator.isLength(username, {min: 7, max: undefined})
  ) return res.status(400).json({ success: false, message: 'Username must be alphanumeric, and be at least 7 characters long.' })

  if(
    !validator.isAlphanumeric(password)
    || validator.isEmpty(password)
  ) return res.status(400).json({ success: false, message: 'Password must contain alphanumeric characters.' })

}