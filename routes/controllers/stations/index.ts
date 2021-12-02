import { Request, Response } from 'express';
import { Station } from '../../../types/stations';
import * as fs from 'fs';
import Loki from 'lokijs';
import { loadCollection } from '../../../utils/index';

const db = new Loki(`${process.env.UPLOAD_PATH}/${process.env.COLLECTION_DATA}`, { persistenceMethod: 'fs' });
// create destination folder if does not exist yet
if (!fs.existsSync(process.env.UPLOAD_PATH)) fs.mkdirSync(process.env.UPLOAD_PATH);

interface StationsRequest extends Request, Station {}
interface StationsResponse extends Response, Station {}

export default {

  /**
   * 
   * @param req ()
   * @param res Array<Station>
   * 
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
  },

  /**
   * 
   * @param req { body: { username: string, password: string }: { body: Station } }
   * @param res { success: boolean }
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
  },

  /**
   * 
   * @param req { body: Station }
   * @param res { success: boolean }
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
  },

  /**
   * 
   * @param req { params: { id: string } }
   * @param res { success: boolean }
   * 
   */

  async deleteStation(req: StationsRequest, res: StationsResponse) {
    try {

      let id: string = req.params.id;

      const col = await loadCollection(process.env.COLLECTION_DATA, db);
      col.findAndRemove({ id });

      db.saveDatabase();

      return res.status(200).json({ success: true })
      
    } catch (err) {
      console.error(err);
    }
  },

}