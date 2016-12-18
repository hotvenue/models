export default function (sequelize, DataTypes) {
  return sequelize.define('user', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        isEmail: true,
      },
      set(email) {
        this.setDataValue('email', email ? email.toLowerCase() : null);
      },
    },

    telegramId: {
      type: DataTypes.STRING,
    },
  }, {
    classMethods: {
      associate: (models) => {
        models.user.hasMany(models.video);
      },
    },
  });
}
