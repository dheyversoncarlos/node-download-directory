/* eslint-disable no-restricted-syntax */
import util from 'util';
import path from 'path';
import * as dotenv from 'dotenv';

dotenv.config();

const filesDir = path.resolve('./src/files');

const HOST_API = process.env.HOST_API || 'http://localhost:3000';

const exec = util.promisify(require('child_process').exec);

const execAwait = async (process:string) => {
  try {
    const { stdout } = await exec(process);
    return stdout;
  } catch (err) {
    return false;
  }
};

export const execute = async (filename: string) => {
  const findResult = await execAwait(`find ${process.env.PATH_TO_SERVER_DOWNLOAD} | grep "${filename}"`);

  if (findResult) {
    const filenames:any[] = [];
    await execAwait(`rm -rf ${filesDir}/*`);
    await execAwait(`touch ${filesDir}/.gitkeep`);

    const filesList = findResult.split('\n');

    for await (const element of filesList) {
      const elPartial = element.split('/');
      const fname = (elPartial[elPartial.length - 1]).split(' ').join('');

      const pathOrig = ((element.split(' ').join('\\ ')).split('(').join('\\('))
        .split(')')
        .join('\\)');
      const pathDest = `${filesDir}/${(fname.split('(').join('\\(')).split(')').join('\\)')}`;

      if (element.length > 0) {
        const cp = await execAwait(`cp ${pathOrig} ${pathDest}`);

        if (cp !== false) {
          filenames.push({ filename: fname, url: `${HOST_API}/files/${fname}` });
        }
      }
    }
    return Promise.resolve(filenames);
  }
};
