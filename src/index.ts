import express from 'express';
import * as dotenv from 'dotenv';
import { routes } from './routes';
import cors from 'cors';

dotenv.config();

const app = express();

const HOST = process.env.HOST || 'localhost';
const PORT = Number(process.env.PORT) || 3333;

app.use(cors());
app.use(express.json());
app.use('/files', express.static('src/files'));
app.use(routes);

app.listen(PORT, HOST, () => {
  console.log(`Listening on http://${HOST}:${PORT}`);
});
