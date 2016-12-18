import { sequelize, Device, Location, User, Video } from '../../index';

describe('Video', () => {
  describe('Class', () => {
    it('should be a valid model', () => {
      expect(Video).toBeDefined();
      expect(Video.rawAttributes).toBeDefined();
    });

    it('should have date attributes', () => {
      expect(Video.rawAttributes.createdAt).toBeDefined();
      expect(Video.rawAttributes.updatedAt).toBeDefined();

      // eslint-disable-next-line no-underscore-dangle
      expect(Video._timestampAttributes.createdAt).toBe('createdAt');
      // eslint-disable-next-line no-underscore-dangle
      expect(Video._timestampAttributes.updatedAt).toBe('updatedAt');
    });

    it('should have a primary key', () => {
      expect(Video.rawAttributes.id).toBeDefined();
      expect(Video.rawAttributes.id.primaryKey).toBe(true);
    });

    it('should have a "name" attribute', () => {
      expect(Video.rawAttributes.name).toBeDefined();
      expect(Video.rawAttributes.name.get).toBeDefined();
    });

    it('should have a "hash" attribute', () => {
      expect(Video.rawAttributes.hash).toBeDefined();
    });

    it('should have a "sent" attribute', () => {
      expect(Video.rawAttributes.sent).toBeDefined();
    });

    it('should have a "ready" attribute', () => {
      expect(Video.rawAttributes.ready).toBeDefined();
    });

    it('should have a "home" attribute', () => {
      expect(Video.rawAttributes.home).toBeDefined();
    });

    it('should have a "privacy" attribute', () => {
      expect(Video.rawAttributes.privacy).toBeDefined();
      expect(Video.rawAttributes.privacy.get).toBeDefined();
      expect(Video.rawAttributes.privacy.set).toBeDefined();
    });

    it('should have a "userId" attribute', () => {
      expect(Video.rawAttributes.userId).toBeDefined();
      expect(Video.rawAttributes.userId.references).toBeDefined();
      expect(Video.rawAttributes.userId.references.model).toBe('users');
      expect(Video.rawAttributes.userId.references.key).toBe('id');
    });

    it('should have a "deviceId" attribute', () => {
      expect(Video.rawAttributes.deviceId).toBeDefined();
      expect(Video.rawAttributes.deviceId.references).toBeDefined();
      expect(Video.rawAttributes.deviceId.references.model).toBe('devices');
      expect(Video.rawAttributes.deviceId.references.key).toBe('id');
    });

    it('should have a "locationId" attribute', () => {
      expect(Video.rawAttributes.locationId).toBeDefined();
      expect(Video.rawAttributes.locationId.references).toBeDefined();
      expect(Video.rawAttributes.locationId.references.model).toBe('locations');
      expect(Video.rawAttributes.locationId.references.key).toBe('id');
    });
  });

  describe('Instance', () => {
    const hash = '1234';
    const sent = true;
    const ready = true;
    const home = true;

    beforeEach(() => sequelize
      .sync({ force: true })
      .then(() => Video.create({ hash, sent, ready, home })));

    describe('Basic', () => {
      it('should find a video', () => Video.findAll()
        .then(videos => expect(videos).toHaveLength(1)));

      it('should find the video', () => Video.findOne({ where: { hash } })
        .then((video) => {
          expect(video).toBeDefined();
          expect(video).toBeInstanceOf(Object);
          expect(video.name).toBeDefined();
          expect(video.hash).toBeDefined();
          expect(video.hash).toBe(hash);
          expect(video.sent).toBeDefined();
          expect(video.sent).toBe(sent);
          expect(video.ready).toBeDefined();
          expect(video.ready).toBe(ready);
          expect(video.home).toBeDefined();
          expect(video.home).toBe(home);
          expect(video.privacy).toBeDefined();
          expect(video.privacy).toEqual({ name: true, publish: true });
        }));

      it('should edit the video', () => Video.findOne({ where: { hash } })
        .then((video) => {
          video.hash = '5678'; // eslint-disable-line no-param-reassign
          video.sent = false; // eslint-disable-line no-param-reassign
          video.ready = false; // eslint-disable-line no-param-reassign
          video.home = false; // eslint-disable-line no-param-reassign
          video.privacy = { name: false, publish: true }; // eslint-disable-line no-param-reassign

          return video.save();
        })
        .then(() => Video.findOne({ where: { hash: '5678' } }))
        .then((video) => {
          expect(video).toBeDefined();
          expect(video.hash).toBe('5678');
          expect(video.sent).toBe(false);
          expect(video.ready).toBe(false);
          expect(video.home).toBe(false);
          expect(video.privacy).toEqual({ name: false, publish: true });
        }));

      it('should delete the video', () => Video.findOne({ where: { hash } })
        .then(video => video.destroy())
        .then(() => Video.findAll())
        .then(videos => expect(videos).toHaveLength(0)));
    });

    describe('Associations', () => {
      const email = 'foo@bar.com';
      const name = 'Device A';
      const geoLatitude = 3.66523;
      const geoLongitude = -114.223236;

      beforeEach(() => Promise.all([
        User.create({ email }),
        Device.create({ name }),
        Location.create({ name, geoLatitude, geoLongitude }),
      ]));

      it('should have an associated "User"', () => Promise.all([
        Video.findOne({ where: { hash } }),
        User.findOne({ where: { email } }),
      ])
        .then(([video, user]) => video.setUser(user))
        .then(video => expect(video.userId).toBeDefined())
        .then(() => Video.findOne({ where: { hash } }))
        .then(video => video.setUser())
        .then(video => expect(video.userId).not.toBeDefined()));

      it('should have an associated "Device"', () => Promise.all([
        Video.findOne({ where: { hash } }),
        Device.findOne({ where: { name } }),
      ])
        .then(([video, device]) => video.setDevice(device))
        .then(video => expect(video.deviceId).toBeDefined())
        .then(() => Video.findOne({ where: { hash } }))
        .then(video => video.setDevice())
        .then(video => expect(video.deviceId).not.toBeDefined()));

      it('should have an associated "Location"', () => Promise.all([
        Video.findOne({ where: { hash } }),
        Location.findOne({ where: { name } }),
      ])
        .then(([video, location]) => video.setLocation(location))
        .then(video => expect(video.locationId).toBeDefined())
        .then(() => Video.findOne({ where: { hash } }))
        .then(video => video.setLocation())
        .then(video => expect(video.locationId).not.toBeDefined()));
    });
  });
});
