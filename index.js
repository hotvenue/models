import fs from 'fs';
import path from 'path';
import config from 'config';
import Sequelize from 'sequelize';
import log from 'hotvenue-utils/utils/log';

const configDatabase = config.get('database');

if (configDatabase.logging) {
  configDatabase.logging = log.db.debug;
}

const sequelize = new Sequelize(
  configDatabase.database,
  configDatabase.username,
  configDatabase.password,
  configDatabase,
);

const models = {};
const modelsDir = path.join(__dirname, 'models');

try {
  fs.readdirSync(modelsDir)
    .filter(filename => filename.substr(-3) === '.js')
    .forEach((filename) => {
      const model = sequelize.import(path.join(modelsDir, filename));

      models[model.name] = model;
    });
} catch (err) {
  if (err.code === 'ENOENT') {
    log.db.warn('No "models" directory');
  } else {
    throw new Error(err);
  }
}

Object.keys(models)
  .filter(modelName => modelName.substr(0, 1) !== '_' && 'associate' in models[modelName])
  .forEach(modelName => models[modelName].associate(models));

const User = models.user;
const Device = models.device;

export {
  Sequelize,
  sequelize,

  User,
  Device,
};
