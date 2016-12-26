import fs from 'fs';
import path from 'path';
import config from 'config';
import Sequelize from 'sequelize';
import log from 'hotvenue-utils/utils/log';

const sequelize = new Sequelize(
  config.has('database.database') ? config.get('database.database') : null,
  config.has('database.username') ? config.get('database.username') : null,
  config.has('database.password') ? config.get('database.password') : null,
  {
    ...config.get('database'),
    logging: config.get('database.logging') ? log.db.debug : false,
  },
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

const Device = models.device;
const Location = models.location;
const User = models.user;
const Video = models.video;

export {
  Sequelize,
  sequelize,

  Device,
  Location,
  User,
  Video,
};
