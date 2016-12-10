import { sequelize, User } from '../../index';

describe('User', () => {
  it('should be a valid model', () => {
    expect(User).toBeDefined();
    expect(User.rawAttributes).toBeDefined();
  });

  it('should have date attributes', () => {
    expect(User.rawAttributes.createdAt).toBeDefined();
    expect(User.rawAttributes.updatedAt).toBeDefined();

    // eslint-disable-next-line no-underscore-dangle
    expect(User._timestampAttributes.createdAt).toBe('createdAt');
    // eslint-disable-next-line no-underscore-dangle
    expect(User._timestampAttributes.updatedAt).toBe('updatedAt');
  });

  it('should have a primary key', () => {
    expect(User.rawAttributes.id).toBeDefined();
    expect(User.rawAttributes.id.primaryKey).toBe(true);
    expect(User.rawAttributes.id.autoIncrement).toBe(true);
  });

  it('should have a "email" attribute', () => {
    expect(User.rawAttributes.email).toBeDefined();
    expect(User.rawAttributes.email.unique).toBe(true);

    expect(User.rawAttributes.email.validate).toBeDefined();
    expect(User.rawAttributes.email.validate.isEmail).toBe(true);
  });

  it('should have a "telegramId" attribute', () => {
    expect(User.rawAttributes.telegramId).toBeDefined();
  });

  describe('Instance', () => {
    const email = 'foo@bar.com';

    beforeEach(() => sequelize
      .sync({ force: true })
      .then(() => User.create({ email })));

    it('should find a user', () => User.findAll()
      .then(users => expect(users).toHaveLength(1)));

    it('should find the user', () => User.findOne({ where: { email } })
      .then((user) => {
        expect(user).toBeDefined();
        expect(user).toBeInstanceOf(Object);
        expect(user.email).toBeDefined();
        expect(user.email).toBe(email);
      }));

    it('should edit the user', () => User.findOne({ where: { email } })
      .then((user) => {
        user.telegramId = '5'; // eslint-disable-line no-param-reassign

        return user.save();
      })
      .then(() => User.findOne({ where: { email } }))
      .then((user) => {
        expect(user).toBeDefined();
        expect(user.email).toBe(email);
        expect(user.telegramId).toBe('5');
      }));

    it('should delete the user', () => User.findOne({ where: { email } })
      .then(user => user.destroy())
      .then(() => User.findAll())
      .then(users => expect(users).toHaveLength(0)));
  });
});
