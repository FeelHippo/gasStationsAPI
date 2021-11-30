import { Request, Response } from 'express';
import { User, UserInterface } from '../models/user';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import validator from 'validator';

class Controller {

  async verify(req: Request, res: Response) {
    try {
      const username: string = req?.params?.username ?? '';
      const registeredUser = await User.findOne({ username });

      if (!registeredUser) return res.status(202).json({ message: 'User not found' })
      return res.status(200).json(registeredUser);

    } catch (err) {
      console.error(err.message)
    }
  }

  async register(req: Request, res: Response) {
    try {
      const credentials: UserInterface = req?.body;
      const { username, password}: { username: string, password: string } = credentials

      if(
        !validator.isAlphanumeric(username)
        || validator.isEmpty(username)
        || !validator.isLength(username, {min: 7, max: undefined})
      ) return res.status(202).json({ success: false, message: 'Username must be alphanumeric, and be at least 7 characters long.' })

      if(
        !validator.isAlphanumeric(password)
        || validator.isEmpty(password)
      ) return res.status(202).json({ success: false, message: 'Password must contain alphanumeric characters.' })

      // make sure there is no duplicate username
      const existingUser: UserInterface = await User.findOne({ username })
      if (existingUser) return res.status(202).json({ success: false, message: 'An account with this name already exists.' })

      // encrypt password
      const salt = await bcrypt.genSalt();
      const passwordHash = await bcrypt.hash(password, salt);

      const newUser = User.instantiate({ username, password: passwordHash });
      await newUser.save();
      return res.status(201).send(newUser);

    } catch (err) {
      console.error(err.message);
    }
  }

  async login(req: Request, res: Response) {
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
      console.error(err.message);
    }
  }

  async verifyToken(req: Request, res: Response) {
    try {
      const token: string = req?.header('X-Auth-Token');
      
      if (!token) return res.json(false);

      const verified: any = jwt.verify(token, process.env.JWT_SECRET); // not elegant but => interface JwtPayload { [key: string]: any; }
      if (!verified) return res.json({ success: false, message: 'User not verified' });

      const user = await User.findById(verified._id);
      if (!user) return res.json({ success: false, message: 'User not found' });

      return res.status(200).json({ success: true });
      
    } catch (err) {
      console.error(err.message);
    }
  }

};

export default new Controller;

