import { execute as FindByFilename } from '../modules/services/findByFilename';
import { Router } from 'express';
import path from 'path';
import * as dotenv from 'dotenv';

dotenv.config();

const pageDir = path.resolve('./src/pages');

const routes = Router();

routes.get('/', (req, res) => {
  res.sendFile(`${pageDir}/search.html`);
});

routes.get('/css/:file', (req, res) => {
  const { file } = req.params;
  res.sendFile(`${pageDir}/css/${file}.css`);
});

routes.post('/search', (req, res) => {
  const { inputTxt, inputUser, inputToken } = req.body;
  
  //validando acesso
  if(process.env.USERNAME == inputUser && process.env.TOKEN == inputToken){
    //efetuando busca
    FindByFilename(inputTxt).then((data) => {
      res.status(200).send(data);
    }).catch((err) => {
      res.status(500).send(err);
    });

  }else{
    res.status(401).send('Not allowed! Verify credentials.')
  }

});

export { routes };
