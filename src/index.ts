import express from 'express';
import * as dotenv from 'dotenv';
import { routes } from './routes';
import cors from 'cors';

dotenv.config();

const app = express();

const PORT = Number(process.env.PORT) || 3000;

app.use(cors());
app.use(express.json());
app.use('/files', express.static('src/files'));
app.use(routes);

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
