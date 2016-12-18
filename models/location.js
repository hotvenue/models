import config from 'config';

import { urlAbsoluteFactory, urlRelativeFactory, fileHookFactory } from '../utils/models';
import { isFileTypeFactory } from '../utils/validators';

const thanksAdd = '-thanks';

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
        isValidImage: isFileTypeFactory(config.get('app.extension.location.frame')),
      },
    },

    frameThanks: {
      type: DataTypes.VIRTUAL,
      validate: {
        isValidImage: isFileTypeFactory(config.get('app.extension.location.frameThanks')),
      },
    },

    watermark: {
      type: DataTypes.VIRTUAL,
      validate: {
        isValidImage: isFileTypeFactory(config.get('app.extension.location.watermark')),
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
      get: urlRelativeFactory.call(this, 'location.frame'),
    },

    urlFrame: {
      type: DataTypes.VIRTUAL,
      get: urlAbsoluteFactory.call(this, 'urlFrameRelative'),
    },

    urlFrameThanksRelative: {
      type: DataTypes.VIRTUAL,
      get: urlRelativeFactory.call(this, 'location.frameThanks', thanksAdd),
    },

    urlFrameThanks: {
      type: DataTypes.VIRTUAL,
      get: urlAbsoluteFactory.call(this, 'urlFrameThanksRelative'),
    },

    urlWatermarkRelative: {
      type: DataTypes.VIRTUAL,
      get: urlRelativeFactory.call(this, 'location.watermark'),
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
        models.location.hasMany(models.video);
      },
    },

    hooks: {
      afterCreate: fileHookFactory('location', ['frame', 'frameThanks', 'watermark'], { frameThanks: thanksAdd }),
      afterUpdate: fileHookFactory('location', ['frame', 'frameThanks', 'watermark'], { frameThanks: thanksAdd }),
      afterSave: fileHookFactory('location', ['frame', 'frameThanks', 'watermark'], { frameThanks: thanksAdd }),
    },
  });
}
