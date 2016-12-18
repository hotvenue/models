import { sequelize, Video } from '../../index';

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

    describe('Validation', () => {});
  });
});
