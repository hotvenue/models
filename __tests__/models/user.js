import { sequelize, User, Video } from '../../index';

describe('User', () => {
  describe('Class', () => {
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
  });

  describe('Instance', () => {
    const email = 'foo@bar.com';

    beforeEach(() => sequelize
      .sync({ force: true })
      .then(() => User.create({ email })));

    describe('Basic', () => {
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

    describe('Validation', () => {
      it('should not allow a user without the email', () => User.create()
        .then(() => { throw new Error('This test should throw an exception'); })
        .catch((err) => {
          expect(err).toBeDefined();
          expect(err.name).toBe('SequelizeValidationError');
          expect(err.errors[0].path).toBe('email');
        }));

      it('should not allow a user with an invalid email', () => User.create({ email: 'foooooo' })
        .then(() => { throw new Error('This test should throw an exception'); })
        .catch((err) => {
          expect(err).toBeDefined();
          expect(err.name).toBe('SequelizeValidationError');
          expect(err.errors[0].path).toBe('email');
        }));

      it('should not allow a user with an email already taken', () => User.create({ email })
        .then(() => { throw new Error('This test should throw an exception'); })
        .catch((err) => {
          expect(err).toBeDefined();
          expect(err.name).toBe('SequelizeUniqueConstraintError');
          expect(err.errors[0].path).toBe('email');
        }));
    });

    describe('Associations', () => {
      const hash1 = '1234';
      const hash2 = '5678';

      beforeEach(() => Promise.all([
        Video.create({ hash: hash1 }),
        Video.create({ hash: hash2 }),
      ]));

      it('should have an associated "Video"', () => Promise.all([
        User.findOne({ where: { email } }),
        Video.findAll(),
      ])
        .then(([user, videos]) => user.setVideos(videos))
        .then(() => User.findOne({ where: { email }, include: [{ model: Video }] }))
        .then(user => expect(user.videos).toHaveLength(2))
        .then(() => User.findOne({ where: { email } }))
        .then(user => user.setVideos())
        .then(() => User.findOne({ where: { email }, include: [{ model: Video }] }))
        .then(user => expect(user.videos).toHaveLength(0))
        .then(() => Promise.all([
          User.findOne({ where: { email } }),
          Video.findOne({ where: { hash: hash1 } }),
        ]))
        .then(([user, video]) => user.addVideo(video))
        .then(() => User.findOne({ where: { email }, include: [{ model: Video }] }))
        .then(user => expect(user.videos).toHaveLength(1))
        .then(() => Promise.all([
          User.findOne({ where: { email } }),
          Video.findOne({ where: { hash: hash1 } }),
        ]))
        .then(([user, video]) => user.addVideo(video))
        .then(() => User.findOne({ where: { email }, include: [{ model: Video }] }))
        .then(user => expect(user.videos).toHaveLength(1))
        .then(() => Promise.all([
          User.findOne({ where: { email } }),
          Video.findOne({ where: { hash: hash2 } }),
        ]))
        .then(([user, video]) => user.addVideo(video))
        .then(() => User.findOne({ where: { email }, include: [{ model: Video }] }))
        .then(user => expect(user.videos).toHaveLength(2))
        .then(() => Promise.all([
          User.findOne({ where: { email } }),
          Video.findOne({ where: { hash: hash2 } }),
        ]))
        .then(([user, video]) => user.removeVideo(video))
        .then(() => User.findOne({ where: { email }, include: [{ model: Video }] }))
        .then(user => expect(user.videos).toHaveLength(1)));
    });
  });
});
