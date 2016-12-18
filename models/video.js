import moment from 'moment';
import config from 'config';

export default function (sequelize, DataTypes) {
  return sequelize.define('video', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
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
  }, {
    classMethods: {
      associate(models) {
        models.device.belongsTo(models.location);
        // models.device.hasMany(models.video);
      },
    },
  });
}
