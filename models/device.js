export default function (sequelize, DataTypes) {
  return sequelize.define('device', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },

    identifierForVendor: {
      type: DataTypes.STRING,
    },

    name: {
      type: DataTypes.STRING,
    },
  }, {
    classMethods: {
      associate: (/* models */) => {
        // models.device.belongsTo(models.location);
        // models.device.hasMany(models.video);
      },
    },
  });
}
