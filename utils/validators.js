import fs from 'fs';
import path from 'path';

export function isFile(filepath) {
  let stat;

  try {
    stat = fs.statSync(filepath);
  } catch (err) {
    throw new Error('Invalid filepath');
  }

  if (!stat.isFile()) {
    throw new Error('Filepath does not indicate a file');
  }
}

export function isFileType(filepath, ext) {
  isFile(filepath);

  const fileext = path.extname(filepath);

  if (fileext !== ext) {
    throw new Error(`The file provided is not a "${ext}" file`);
  }
}
