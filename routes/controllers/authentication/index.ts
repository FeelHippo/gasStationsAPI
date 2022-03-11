import { Request, Response, NextFunction } from 'express';
import { User, UserInterface } from '../../../models/user';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { handleValidation } from '../../../utils/index';
import HttpException from '../../../exceptions/HttpException';

export default {

  /**
   * 
   * @param req { params: { username: string } }
   * @param res { registeredUser: UserInterface }
   * 
   */

  async verify(req: Request, res: Response, next: NextFunction) {
    try {
      const username: string = req?.params?.username ?? '';
      const registeredUser = await User.findOne({ username });

      if (!registeredUser) return res.status(202).json({ message: 'User not found' })
      return res.status(200).json(registeredUser);

    } catch (err) {
      next(new HttpException(404, err.message));
    }
  },


  /**
   * 
   * @param req { body: { username: string, password: string }: { body: UserInterface } }
   * @param res { newUser: UserInterface, success: boolean, message?: string }
   * 
   */

  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const credentials: UserInterface = req?.body;
      const { username, password}: { username: string, password: string } = credentials

      // validate username and password
      handleValidation(username, password, res);

      // make sure there is no duplicate username
      const existingUser: UserInterface = await User.findOne({ username })
      if (existingUser) return res.status(202).json({ success: false, message: 'An account with this name already exists.' })

      // encrypt password
      const salt = await bcrypt.genSalt();
      const passwordHash = await bcrypt.hash(password, salt);

      const newUser = User.instantiate({ username, password: passwordHash });
      await newUser.save();
      return res.status(201).send({ ...newUser, success: true });

    } catch (err) {
      next(new HttpException(404, err.message));
    }
  },

  /**
   * 
   * @param req { body: { username: string, password: string }: { body: UserInterface } }
   * @param res { username: string, password: string, success: boolean, token?: string, message?: string }
   * 
   */

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const credentials: UserInterface = req?.body;
      const { username, password}: { username: string, password: string } = credentials

      const user: UserInterface = await User.findOne({ username });

      // if no user is found, or if password is wrong:
      if (!user || !await bcrypt.compare(password, user.password)) 
        return res.status(202).json({ success: false, message: 'Wrong credentials, try again.'  });

      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

      return res.status(200).json({
        username,
        password,
        success: true,
        token,
      })
      
    } catch (err) {
      next(new HttpException(404, err.message));
    }
  },

  /**
   * 
   * @param req { header: { 'X-Auth-Token': string } }
   * @param res { success: boolean, message?: string }
   * 
   */

  async verifyToken(req: Request, res: Response, next: NextFunction) {
    try {
      const token: string = req?.header('X-Auth-Token');
      
      if (!token) return res.json({ success: false, message: 'No Auth Token' });

      const verified: any = jwt.verify(token, process.env.JWT_SECRET);
      if (!verified) return res.json({ success: false, message: 'User not verified' });

      const user = await User.findById(verified._id);
      if (!user) return res.json({ success: false, message: 'User not found' });

      return res.status(200).json({ success: true });
      
    } catch (err) {
      next(new HttpException(404, err.message));
    }
  },

}