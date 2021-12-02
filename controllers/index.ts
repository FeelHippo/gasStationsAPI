import { Request, Response } from 'express';
// authentication 
import { User, UserInterface } from '../models/user';
import { Station } from '../models/stations';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import validator from 'validator';

// data
import * as fs from 'fs';
import Loki from 'lokijs';
import { loadCollection } from '../utils/collection';

const db = new Loki(`${process.env.UPLOAD_PATH}/${process.env.COLLECTION_DATA}`, { persistenceMethod: 'fs' });
// create destination folder if does not exist yet
if (!fs.existsSync(process.env.UPLOAD_PATH)) fs.mkdirSync(process.env.UPLOAD_PATH);

interface StationsRequest extends Request, Station {}
interface StationsResponse extends Response, Station {}


class Controller {

  /**
   * 
   * @param req { params: { username: string } }
   * @param res { registeredUser: UserInterface }
   * 
   */

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


  /**
   * 
   * @param req { body: { username: string, password: string } }
   * @param res { newUser: UserInterface, success: boolean, message?: string }
   * 
   */

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
      return res.status(201).send({ ...newUser, success: true });

    } catch (err) {
      console.error(err.message);
    }
  }

  /**
   * 
   * @param req { body: { username: string, password: string } }
   * @param res { username: string, password: string, success: boolean, token?: string, message?: string }
   * 
   */

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

  /**
   * 
   * @param req { header: { 'X-Auth-Token': string } }
   * @param res { success: boolean, message?: string }
   * 
   */

  async verifyToken(req: Request, res: Response) {
    try {
      const token: string = req?.header('X-Auth-Token');
      
      if (!token) return res.json({ success: false, message: 'No Auth Token' });

      const verified: any = jwt.verify(token, process.env.JWT_SECRET); // not elegant but => interface JwtPayload { [key: string]: any; }
      if (!verified) return res.json({ success: false, message: 'User not verified' });

      const user = await User.findById(verified._id);
      if (!user) return res.json({ success: false, message: 'User not found' });

      return res.status(200).json({ success: true });
      
    } catch (err) {
      console.error(err.message);
    }
  }

  /**
   * 
   * @param req ()
   * @param res { success: boolean, message?: string }
   * @return Array<Station>
   */

  async getAllStations(req: Request, res: StationsResponse) {
    try {

      const col = await loadCollection(process.env.COLLECTION_DATA, db);
      const { data } = col;
      const filteredData = data.map(({ $loki, ...station }) => ({ ...station }));
      return res.status(200).json(filteredData);

    } catch (err) {
      console.error(err.message);
    }
  }

  /**
   * 
   * @param req ()
   * @param res { success: boolean, message?: string }
   */

  async postStation(req: StationsRequest, res: StationsResponse) {
    try {

      const newStation: Station = req.body;
      
      const col = await loadCollection(process.env.COLLECTION_DATA, db);

      col.setChangesApi(false);
      col.insert(newStation);
      db.saveDatabase();

      return res.status(200).json({ success: true })

    } catch (err) {
      console.error(err);
    }
  }

  /**
   * 
   * @param req ()
   * @param res { success: boolean, message?: string }
   */

  async updateStation(req: StationsRequest, res: StationsResponse) {
    try {
      
      let newStation: Station = req.body;
      
      const col = await loadCollection(process.env.COLLECTION_DATA, db);
      col.findAndUpdate({ id: newStation.id }, data => {
        
        data.name = newStation.name
        data.address = newStation.address
        data.city = newStation.city
        data.pumps = newStation.pumps

        return data
      })
      
      db.saveDatabase();

      return res.status(200).json({ success: true })

    } catch (err) {
      console.error(err);
    }
  }

};

export default new Controller;

