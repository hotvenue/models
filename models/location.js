import path from 'path';
import config from 'config';
import { upload } from 'hotvenue-utils/utils/cloud';

import { isFileType } from '../utils/validators';

const thanksAdd = '-thanks';

function isImageFactory(ext) {
  return function isImage(filepath) {
    isFileType(filepath, ext);
  };
}

function imageHookFactory(location) {
  return Promise.all(['frame', 'frameThanks', 'watermark'].map((what) => {
    const nameAdd = what === 'frameThanks' ? thanksAdd : '';

    if (location.changed(what)) {
      const filepath = location[what];
      const ext = path.extname(filepath);

      return upload(filepath, `${config.get(`aws.s3.folder.location.tmp-${what}`)}/${location.id}${nameAdd || ''}${ext}`);
    }

    return true;
  }));
}

function urlRelativeFactory(what, nameAdd) {
  return function urlRelative() {
    const file = `${config.get(`aws.s3.folder.location.${what}`)}/${this.id}${nameAdd || ''}`;
    const files = {
      original: `${file}${config.get(`app.extension.${what}`)}`,
    };

    Object.keys(config.get(`app.location.${what}.sizes`)).forEach((key) => {
      files[key] = `${file}@${key}${config.get(`app.extension.${what}`)}`;
    });

    return files;
  };
}

function urlAbsoluteFactory(what) {
  return function urlAbsolute() {
    const urls = {};

    Object.keys(this[what]).forEach((size) => {
      urls[size] = [
        `https://s3-${config.get('aws.region')}.amazonaws.com`,
        config.get('aws.s3.bucket'),
        this[what][size],
      ].join('/');
    });

    return urls;
  };
}

export default function (sequelize, DataTypes) {
  return sequelize.define('location', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },

    frame: {
      type: DataTypes.VIRTUAL,
      validate: {
        isValidImage: isImageFactory(config.get('app.extension.frame')),
      },
    },

    frameThanks: {
      type: DataTypes.VIRTUAL,
      validate: {
        isValidImage: isImageFactory(config.get('app.extension.frameThanks')),
      },
    },

    watermark: {
      type: DataTypes.VIRTUAL,
      validate: {
        isValidImage: isImageFactory(config.get('app.extension.watermark')),
      },
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    hashtag: {
      type: DataTypes.STRING,
    },

    email: {
      type: DataTypes.STRING,
      validate: {
        isEmail: true,
      },
      set(email) {
        this.setDataValue('email', email.toLowerCase());
      },
    },

    geoLatitude: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      validate: { min: -90, max: 90 },
    },

    geoLongitude: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      validate: { min: -180, max: 180 },
    },

    urlFrameRelative: {
      type: DataTypes.VIRTUAL,
      get: urlRelativeFactory.call(this, 'frame'),
    },

    urlFrame: {
      type: DataTypes.VIRTUAL,
      get: urlAbsoluteFactory.call(this, 'urlFrameRelative'),
    },

    urlFrameThanksRelative: {
      type: DataTypes.VIRTUAL,
      get: urlRelativeFactory.call(this, 'frameThanks', thanksAdd),
    },

    urlFrameThanks: {
      type: DataTypes.VIRTUAL,
      get: urlAbsoluteFactory.call(this, 'urlFrameThanksRelative'),
    },

    urlWatermarkRelative: {
      type: DataTypes.VIRTUAL,
      get: urlRelativeFactory.call(this, 'watermark'),
    },

    urlWatermark: {
      type: DataTypes.VIRTUAL,
      get: urlAbsoluteFactory.call(this, 'urlWatermarkRelative'),
    },

    checkboxes: {
      type: DataTypes.VIRTUAL,
      get() {
        return config.get(`app.location.checkboxes.${this.email ? 'private' : 'public'}Events`);
      },
    },
  }, {
    classMethods: {
      associate(models) {
        models.location.hasMany(models.device);
        // models.location.hasMany(models.video);
      },
    },

    hooks: {
      afterCreate: imageHookFactory,
      afterUpdate: imageHookFactory,
      afterSave: imageHookFactory,
    },
  });
}
