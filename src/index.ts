import dotenv from 'dotenv';
import App from './server';

dotenv.config();
new App().listen();
