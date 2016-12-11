import path from 'path';
import config from 'config';
import { upload } from 'hotvenue-utils/utils/cloud';

function imageFactory(what, nameAdd) {
  return function set(filepath) {
    const ext = path.extname(filepath);

    if (ext !== config.get(`app.extension.${what}`)) {
      throw new Error(`The "${what}" file provided is not a "${config.get(`app.extension.${what}`)}" image`);
    }

    upload(filepath, `${config.get(`aws.s3.folder.location.tmp-${what}`)}/${this.id}${nameAdd || ''}${ext}`);
  };
}

function urlRelativeFactory(what, nameAdd) {
  return function urlRelative() {
    const file = `${config.get(`aws.s3.folder.location.${what}`)}/${this.id}${nameAdd || ''}`;
    const files = {};

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
  const thanksAdd = '-thanks';

  return sequelize.define('location', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },

    frame: {
      type: DataTypes.VIRTUAL,
      set: imageFactory.call(this, 'frame'),
    },

    frameThanks: {
      type: DataTypes.VIRTUAL,
      set: imageFactory.call(this, 'frameThanks', thanksAdd),
    },

    watermark: {
      type: DataTypes.VIRTUAL,
      set: imageFactory.call(this, 'watermark'),
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
      associate: (/* models */) => {
        // models.location.hasMany(models.video);
        // models.location.hasMany(models.device);
      },
    },
  });
}
