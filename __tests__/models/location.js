import path from 'path';

import { sequelize, Location, Device } from '../../index';

describe('Location', () => {
  describe('Class', () => {
    it('should be a valid model', () => {
      expect(Location).toBeDefined();
      expect(Location.rawAttributes).toBeDefined();
    });

    it('should have date attributes', () => {
      expect(Location.rawAttributes.createdAt).toBeDefined();
      expect(Location.rawAttributes.updatedAt).toBeDefined();

      // eslint-disable-next-line no-underscore-dangle
      expect(Location._timestampAttributes.createdAt).toBe('createdAt');
      // eslint-disable-next-line no-underscore-dangle
      expect(Location._timestampAttributes.updatedAt).toBe('updatedAt');
    });

    it('should have a primary key', () => {
      expect(Location.rawAttributes.id).toBeDefined();
      expect(Location.rawAttributes.id.primaryKey).toBe(true);
    });

    it('should have a "name" attribute', () => {
      expect(Location.rawAttributes.name).toBeDefined();
      expect(Location.rawAttributes.name.allowNull).toBe(false);
    });

    it('should have a "hashtag" attribute', () => {
      expect(Location.rawAttributes.hashtag).toBeDefined();
    });

    it('should have a "email" attribute', () => {
      expect(Location.rawAttributes.email).toBeDefined();

      expect(Location.rawAttributes.email.validate).toBeDefined();
      expect(Location.rawAttributes.email.validate.isEmail).toBe(true);
    });

    it('should have a "geoLatitude" attribute', () => {
      expect(Location.rawAttributes.geoLatitude).toBeDefined();
      expect(Location.rawAttributes.geoLatitude.allowNull).toBe(false);

      expect(Location.rawAttributes.geoLatitude.validate).toBeDefined();
      expect(Location.rawAttributes.geoLatitude.validate.min).toBe(-90);
      expect(Location.rawAttributes.geoLatitude.validate.max).toBe(90);
    });

    it('should have a "geoLongitude" attribute', () => {
      expect(Location.rawAttributes.geoLongitude).toBeDefined();
      expect(Location.rawAttributes.geoLongitude.allowNull).toBe(false);

      expect(Location.rawAttributes.geoLongitude.validate).toBeDefined();
      expect(Location.rawAttributes.geoLongitude.validate.min).toBe(-180);
      expect(Location.rawAttributes.geoLongitude.validate.max).toBe(180);
    });

    it('should have a "frame" attribute', () => {
      expect(Location.rawAttributes.frame).toBeDefined();
      expect(Location.rawAttributes.frame.validate).toBeDefined();
    });

    it('should have a "frameThanks" attribute', () => {
      expect(Location.rawAttributes.frameThanks).toBeDefined();
      expect(Location.rawAttributes.frameThanks.validate).toBeDefined();
    });

    it('should have a "watermark" attribute', () => {
      expect(Location.rawAttributes.watermark).toBeDefined();
      expect(Location.rawAttributes.watermark.validate).toBeDefined();
    });

    it('should have a "urlFrameRelative" attribute', () => {
      expect(Location.rawAttributes.urlFrameRelative).toBeDefined();
      expect(Location.rawAttributes.urlFrameRelative.get).toBeDefined();
    });

    it('should have a "urlFrame" attribute', () => {
      expect(Location.rawAttributes.urlFrame).toBeDefined();
      expect(Location.rawAttributes.urlFrame.get).toBeDefined();
    });

    it('should have a "urlFrameThanksRelative" attribute', () => {
      expect(Location.rawAttributes.urlFrameThanksRelative).toBeDefined();
      expect(Location.rawAttributes.urlFrameThanksRelative.get).toBeDefined();
    });

    it('should have a "urlFrameThanks" attribute', () => {
      expect(Location.rawAttributes.urlFrameThanks).toBeDefined();
      expect(Location.rawAttributes.urlFrameThanks.get).toBeDefined();
    });

    it('should have a "urlWatermarkRelative" attribute', () => {
      expect(Location.rawAttributes.urlWatermarkRelative).toBeDefined();
      expect(Location.rawAttributes.urlWatermarkRelative.get).toBeDefined();
    });

    it('should have a "urlWatermark" attribute', () => {
      expect(Location.rawAttributes.urlWatermark).toBeDefined();
      expect(Location.rawAttributes.urlWatermark.get).toBeDefined();
    });

    it('should have a "checkboxes" attribute', () => {
      expect(Location.rawAttributes.checkboxes).toBeDefined();
      expect(Location.rawAttributes.checkboxes.get).toBeDefined();
    });
  });

  describe('Instance', () => {
    const name = 'Location A';
    const geoLatitude = 3.66523;
    const geoLongitude = -114.223236;

    const hashtag = '#foobar';

    beforeEach(() => sequelize
      .sync({ force: true })
      .then(() => Location.create({ name, geoLatitude, geoLongitude })));

    describe('Basic', () => {
      it('should find a location', () => Location.findAll()
        .then(locations => expect(locations).toHaveLength(1)));

      it('should find the location', () => Location.findOne({ where: { name } })
        .then((location) => {
          expect(location).toBeDefined();
          expect(location).toBeInstanceOf(Object);

          expect(location.name).toBeDefined();
          expect(location.name).toBe(name);
          expect(location.geoLatitude).toBeDefined();
          expect(location.geoLatitude).toBe(geoLatitude);
          expect(location.geoLongitude).toBeDefined();
          expect(location.geoLongitude).toBe(geoLongitude);
        }));

      it('should edit the location', () => Location.findOne({ where: { name } })
        .then((location) => {
          location.hashtag = hashtag; // eslint-disable-line no-param-reassign

          return location.save();
        })
        .then(() => Location.findOne({ where: { name } }))
        .then((location) => {
          expect(location).toBeDefined();
          expect(location.name).toBe(name);
          expect(location.geoLatitude).toBe(geoLatitude);
          expect(location.geoLongitude).toBe(geoLongitude);
          expect(location.hashtag).toBe(hashtag);
        }));

      it('should delete the location', () => Location.findOne({ where: { name } })
        .then(location => location.destroy())
        .then(() => Location.findAll())
        .then(locations => expect(locations).toHaveLength(0)));
    });

    describe('Validation', () => {
      it('should not allow a location without the name', () => Location.create({ geoLatitude, geoLongitude })
        .then(() => { throw new Error('This test should throw an exception'); })
        .catch((err) => {
          expect(err).toBeDefined();
          expect(err.name).toBe('SequelizeValidationError');
          expect(err.errors[0].path).toBe('name');
        }));

      it('should not allow a location without the geoLatitude', () => Location.create({ name, geoLongitude })
        .then(() => { throw new Error('This test should throw an exception'); })
        .catch((err) => {
          expect(err).toBeDefined();
          expect(err.name).toBe('SequelizeValidationError');
          expect(err.errors[0].path).toBe('geoLatitude');
        }));

      it('should not allow a location without the geoLongitude', () => Location.create({ name, geoLatitude })
        .then(() => { throw new Error('This test should throw an exception'); })
        .catch((err) => {
          expect(err).toBeDefined();
          expect(err.name).toBe('SequelizeValidationError');
          expect(err.errors[0].path).toBe('geoLongitude');
        }));

      it('should not allow a non-email', () => Location.create({
        name,
        geoLatitude,
        geoLongitude,
        email: 'foooooo',
      })
        .then(() => { throw new Error('This test should throw an exception'); })
        .catch((err) => {
          expect(err).toBeDefined();
          expect(err.name).toBe('SequelizeValidationError');
          expect(err.errors[0].path).toBe('email');
        }));

      it('should not allow an "out of boundaries" geoLatitude (-)', () => Location.create({
        name,
        geoLatitude: -120.00923,
        geoLongitude,
      })
        .then(() => { throw new Error('This test should throw an exception'); })
        .catch((err) => {
          expect(err).toBeDefined();
          expect(err.name).toBe('SequelizeValidationError');
          expect(err.errors[0].path).toBe('geoLatitude');
        }));

      it('should not allow an "out of boundaries" geoLatitude (+)', () => Location.create({
        name,
        geoLatitude: 120.00923,
        geoLongitude,
      })
        .then(() => { throw new Error('This test should throw an exception'); })
        .catch((err) => {
          expect(err).toBeDefined();
          expect(err.name).toBe('SequelizeValidationError');
          expect(err.errors[0].path).toBe('geoLatitude');
        }));

      it('should not allow an "out of boundaries" geoLongitude (-)', () => Location.create({
        name,
        geoLatitude,
        geoLongitude: -190.00923,
      })
        .then(() => { throw new Error('This test should throw an exception'); })
        .catch((err) => {
          expect(err).toBeDefined();
          expect(err.name).toBe('SequelizeValidationError');
          expect(err.errors[0].path).toBe('geoLongitude');
        }));

      it('should not allow an "out of boundaries" geoLongitude (+)', () => Location.create({
        name,
        geoLatitude,
        geoLongitude: 190.00923,
      })
        .then(() => { throw new Error('This test should throw an exception'); })
        .catch((err) => {
          expect(err).toBeDefined();
          expect(err.name).toBe('SequelizeValidationError');
          expect(err.errors[0].path).toBe('geoLongitude');
        }));

      ['frame', 'frameThanks', 'watermark'].forEach((what) => {
        describe(`Image "${what}"`, () => {
          const args = {
            name,
            geoLatitude,
            geoLongitude,
          };

          const args1 = { ...args };
          args1[what] = 'foo';

          it('should throw an error if the file is not valid', () => Location.create(args1)
            .then(() => { throw new Error('This test should throw an exception'); })
            .catch((err) => {
              expect(err).toBeDefined();
              expect(err.name).toBe('SequelizeValidationError');
              expect(err.errors[0].path).toBe(what);
            }));

          const args2 = { ...args };
          args2[what] = path.join(__dirname, '..', 'assets', 'file.txt');

          it('should throw an error if the file is not an image', () => Location.create(args2)
            .then(() => { throw new Error('This test should throw an exception'); })
            .catch((err) => {
              expect(err).toBeDefined();
              expect(err.name).toBe('SequelizeValidationError');
              expect(err.errors[0].path).toBe(what);
            }));

          const args3 = { ...args };
          args3[what] = path.join(__dirname, '..', 'assets', 'image.jpg');

          it('should throw an error if the image is not the right type', () => Location.create(args2)
            .then(() => { throw new Error('This test should throw an exception'); })
            .catch((err) => {
              expect(err).toBeDefined();
              expect(err.name).toBe('SequelizeValidationError');
              expect(err.errors[0].path).toBe(what);
            }));
        });
      });
    });

    describe('Beautify', () => {
      const email = 'FOO@BAR.com';

      it('should rewrite the email into lower case', () => Location.create({
        name,
        geoLatitude,
        geoLongitude,
        email,
      })
        .then(location => expect(location.email).toBe(email.toLowerCase())));
    });

    describe('Urls', () => {
      it('should populate "frame" urls', () => Location.findOne({ name })
        .then((location) => {
          expect(location.urlFrame).toBeInstanceOf(Object);
          expect(location.urlFrame['1x']).toBeDefined();
          expect(location.urlFrame['1x']).toMatch(location.id);
          expect(location.urlFrame['2x']).toBeDefined();
          expect(location.urlFrame['2x']).toMatch(location.id);
          expect(location.urlFrame.pro).toBeDefined();
          expect(location.urlFrame.pro).toMatch(location.id);
        }));

      it('should populate "frame" relative urls', () => Location.findOne({ name })
        .then((location) => {
          expect(location.urlFrameRelative).toBeInstanceOf(Object);
          expect(location.urlFrameRelative['1x']).toBeDefined();
          expect(location.urlFrameRelative['1x']).toMatch(location.id);
          expect(location.urlFrameRelative['2x']).toBeDefined();
          expect(location.urlFrameRelative['2x']).toMatch(location.id);
          expect(location.urlFrameRelative.pro).toBeDefined();
          expect(location.urlFrameRelative.pro).toMatch(location.id);
        }));

      it('should populate "frameThanks" urls', () => Location.findOne({ name })
        .then((location) => {
          expect(location.urlFrameThanks).toBeInstanceOf(Object);
          expect(location.urlFrameThanks['1x']).toBeDefined();
          expect(location.urlFrameThanks['1x']).toMatch(location.id);
          expect(location.urlFrameThanks['2x']).toBeDefined();
          expect(location.urlFrameThanks['2x']).toMatch(location.id);
          expect(location.urlFrameThanks.pro).toBeDefined();
          expect(location.urlFrameThanks.pro).toMatch(location.id);
        }));

      it('should populate "frameThanks" relative urls', () => Location.findOne({ name })
        .then((location) => {
          expect(location.urlFrameThanksRelative).toBeInstanceOf(Object);
          expect(location.urlFrameThanksRelative['1x']).toBeDefined();
          expect(location.urlFrameThanksRelative['1x']).toMatch(location.id);
          expect(location.urlFrameThanksRelative['2x']).toBeDefined();
          expect(location.urlFrameThanksRelative['2x']).toMatch(location.id);
          expect(location.urlFrameThanksRelative.pro).toBeDefined();
          expect(location.urlFrameThanksRelative.pro).toMatch(location.id);
        }));

      it('should populate "watermark" urls', () => Location.findOne({ name })
        .then((location) => {
          expect(location.urlWatermark).toBeInstanceOf(Object);
          expect(location.urlWatermark['1x']).toBeDefined();
          expect(location.urlWatermark['1x']).toMatch(location.id);
          expect(location.urlWatermark['2x']).toBeDefined();
          expect(location.urlWatermark['2x']).toMatch(location.id);
          expect(location.urlWatermark.pro).toBeDefined();
          expect(location.urlWatermark.pro).toMatch(location.id);
        }));

      it('should populate "watermark" relative urls', () => Location.findOne({ name })
        .then((location) => {
          expect(location.urlWatermarkRelative).toBeInstanceOf(Object);
          expect(location.urlWatermarkRelative['1x']).toBeDefined();
          expect(location.urlWatermarkRelative['1x']).toMatch(location.id);
          expect(location.urlWatermarkRelative['2x']).toBeDefined();
          expect(location.urlWatermarkRelative['2x']).toMatch(location.id);
          expect(location.urlWatermarkRelative.pro).toBeDefined();
          expect(location.urlWatermarkRelative.pro).toMatch(location.id);
        }));
    });

    describe('Checkboxes', () => {
      it('should have the checkboxes', () => Location.findOne({ name })
        .then((location) => {
          expect(location.checkboxes).toBeDefined();
          expect(location.checkboxes).toHaveLength(2);

          expect(location.checkboxes[0].mandatory).toBeDefined();
          expect(location.checkboxes[0].name).toBeDefined();
          expect(location.checkboxes[0].text).toBeDefined();

          expect(location.checkboxes[1].mandatory).toBeDefined();
          expect(location.checkboxes[1].name).toBeDefined();
          expect(location.checkboxes[1].text).toBeDefined();
        }));
    });

    describe('Associations', () => {
      const nameA = 'Device A';
      const nameB = 'Device B';

      beforeEach(() => Promise.all([
        Device.create({ name: nameA }),
        Device.create({ name: nameB }),
      ]));

      it('should add the two devices to the location', () => Promise.all([
        Location.findOne({ where: { name } }),
        Device.findOne({ where: { name: nameA } }),
      ])
        .then(([location, device]) => location.addDevice(device))
        .then(location => location.reload({ include: [{ model: Device }] }))
        .then(location => expect(location.devices).toHaveLength(1))
        .then(() => Device.findOne({ where: { name: nameA } }))
        .then(device => expect(device.locationId).toBeDefined())
        .then(() => Promise.all([
          Location.findOne({ where: { name } }),
          Device.findOne({ where: { name: nameB } }),
        ]))
        .then(([location, device]) => location.addDevice(device))
        .then(location => location.reload({ include: [{ model: Device }] }))
        .then(location => expect(location.devices).toHaveLength(2)));

      it('should set the two devices to the location', () => Promise.all([
        Location.findOne({ where: { name } }),
        Device.findOne({ where: { name: nameA } }),
        Device.findOne({ where: { name: nameB } }),
      ])
        .then(([location, deviceA, deviceB]) => location.setDevices([deviceA, deviceB]))
        .then(location => location.reload({ include: [{ model: Device }] }))
        .then(location => expect(location.devices).toHaveLength(2))
        .then(() => Device.findOne({ where: { name: nameA } }))
        .then(device => expect(device.locationId).toBeDefined()));
    });

    describe('Files', () => {
      it('should change something', () => Location.findOne({ where: { name } })
        .then(() => {}));
    });
  });
});
