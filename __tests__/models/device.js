import { sequelize, Device, Location } from '../../index';

describe('Device', () => {
  describe('Class', () => {
    it('should be a valid model', () => {
      expect(Device).toBeDefined();
      expect(Device.rawAttributes).toBeDefined();
    });

    it('should have date attributes', () => {
      expect(Device.rawAttributes.createdAt).toBeDefined();
      expect(Device.rawAttributes.updatedAt).toBeDefined();

      // eslint-disable-next-line no-underscore-dangle
      expect(Device._timestampAttributes.createdAt).toBe('createdAt');
      // eslint-disable-next-line no-underscore-dangle
      expect(Device._timestampAttributes.updatedAt).toBe('updatedAt');
    });

    it('should have a primary key', () => {
      expect(Device.rawAttributes.id).toBeDefined();
      expect(Device.rawAttributes.id.primaryKey).toBe(true);
    });

    it('should have a "identifierForVendor" attribute', () => {
      expect(Device.rawAttributes.identifierForVendor).toBeDefined();
    });

    it('should have a "name" attribute', () => {
      expect(Device.rawAttributes.name).toBeDefined();
    });

    it('should have a "locationId" attribute', () => {
      expect(Device.rawAttributes.locationId).toBeDefined();
      expect(Device.rawAttributes.locationId.references).toBeDefined();
      expect(Device.rawAttributes.locationId.references.model).toBe('locations');
      expect(Device.rawAttributes.locationId.references.key).toBe('id');
    });
  });

  describe('Instance', () => {
    const name = 'Device A';

    beforeEach(() => sequelize
      .sync({ force: true })
      .then(() => Device.create({ name })));

    describe('Basic', () => {
      it('should find a device', () => Device.findAll()
        .then(devices => expect(devices).toHaveLength(1)));

      it('should find the device', () => Device.findOne({ where: { name } })
        .then((device) => {
          expect(device).toBeDefined();
          expect(device).toBeInstanceOf(Object);
          expect(device.name).toBeDefined();
          expect(device.name).toBe(name);
        }));

      it('should edit the device', () => Device.findOne({ where: { name } })
        .then((device) => {
          device.identifierForVendor = '5'; // eslint-disable-line no-param-reassign

          return device.save();
        })
        .then(() => Device.findOne({ where: { name } }))
        .then((device) => {
          expect(device).toBeDefined();
          expect(device.name).toBe(name);
          expect(device.identifierForVendor).toBe('5');
        }));

      it('should delete the device', () => Device.findOne({ where: { name } })
        .then(device => device.destroy())
        .then(() => Device.findAll())
        .then(devices => expect(devices).toHaveLength(0)));
    });

    describe('Associations', () => {
      const geoLatitude = 3.66523;
      const geoLongitude = -114.223236;

      beforeEach(() => Location.create({ name, geoLatitude, geoLongitude }));

      it('should set the location of the device', () => Promise.all([
        Location.findOne({ where: { name } }),
        Device.findOne({ where: { name } }),
      ])
        .then(([location, device]) => {
          device.location = location; // eslint-disable-line no-param-reassign

          return device.save();
        })
        .then((device) => {
          expect(device.location).toBeDefined();
          expect(device.location.name).toBe(name);
          expect(device.location.geoLatitude).toBe(geoLatitude);
          expect(device.location.geoLongitude).toBe(geoLongitude);
        }));

      it('should set the location of the device but not populate it', () => Promise.all([
        Location.findOne({ where: { name } }),
        Device.findOne({ where: { name } }),
      ])
        .then(([location, device]) => device.setLocation(location))
        .then(device =>
          expect(device.locationId).toBeDefined()
          &&
          expect(device.location).not.toBeDefined())
        .then(() => Location.findOne({ where: { name }, include: [{ model: Device }] }))
        .then(location => expect(location.devices).toHaveLength(1)));

      it('should set the location of the device and populate it', () => Promise.all([
        Location.findOne({ where: { name } }),
        Device.findOne({ where: { name } }),
      ])
        .then(([location, device]) => device.setLocation(location, {
          include: [
            { model: Location },
          ],
        }))
        .then(device =>
          expect(device.locationId).toBeDefined()
          &&
          expect(device.location).toBeDefined()));

      it('should remove the association', () => Promise.all([
        Location.findOne({ where: { name } }),
        Device.findOne({ where: { name } }),
      ])
        .then(([location, device]) => device.setLocation(location))
        .then(device => expect(device.locationId).toBeDefined())
        .then(() => Device.findOne({ where: { name } }))
        .then(device => device.setLocation())
        .then(device => expect(device.locationId).not.toBeDefined()));
    });
  });
});
