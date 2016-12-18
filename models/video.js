import moment from 'moment';
import config from 'config';

import { urlAbsoluteFactory, urlRelativeFactory, fileHookFactory } from '../utils/models';
import { isFileTypeFactory } from '../utils/validators';

export default function (sequelize, DataTypes) {
  return sequelize.define('video', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },

    file: {
      type: DataTypes.VIRTUAL,
      validate: {
        isValidImage: isFileTypeFactory(config.get('app.extension.video.upload')),
      },
    },

    name: {
      type: DataTypes.VIRTUAL,
      get() {
        const date = moment(this.createdAt).format('YYYY-MM-DD_HH-mm-ss');

        return `video-${date}${config.get('app.extension.video')}`;
      },
    },

    hash: {
      type: DataTypes.STRING,
    },

    sent: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    ready: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    home: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    privacy: {
      type: DataTypes.STRING,
      defaultValue: '{"name":true,"publish":true}',
      set(privacy) {
        this.setDataValue('privacy', typeof privacy === 'object' ? JSON.stringify(privacy) : privacy);
      },
      get() {
        return JSON.parse(this.getDataValue('privacy'));
      },
    },

    urlOriginalRelative: {
      type: DataTypes.VIRTUAL,
      get: urlRelativeFactory.call(this, 'video.original'),
    },

    urlOriginal: {
      type: DataTypes.VIRTUAL,
      get: urlAbsoluteFactory.call(this, 'urlOriginalRelative'),
    },

    urlEditedARelative: {
      type: DataTypes.VIRTUAL,
      get: urlRelativeFactory.call(this, 'video.editedA'),
    },

    urlEditedA: {
      type: DataTypes.VIRTUAL,
      get: urlAbsoluteFactory.call(this, 'urlEditedARelative'),
    },

    urlPreviewRelative: {
      type: DataTypes.VIRTUAL,
      get: urlRelativeFactory.call(this, 'video.preview'),
    },

    urlPreview: {
      type: DataTypes.VIRTUAL,
      get: urlAbsoluteFactory.call(this, 'urlPreviewRelative'),
    },
  }, {
    classMethods: {
      associate(models) {
        models.video.belongsTo(models.user);
        models.video.belongsTo(models.device);
        models.video.belongsTo(models.location);
      },
    },

    hooks: {
      afterCreate: fileHookFactory('video', ['file']),
      afterUpdate: fileHookFactory('video', ['file']),
      afterSave: fileHookFactory('video', ['file']),
    },
  });
}
