import { sequelize, Device } from '../../index';

describe('Device', () => {
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

  describe('Instance', () => {
    const name = 'location-A';

    beforeEach(() => sequelize
      .sync({ force: true })
      .then(() => Device.create({ name })));

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
});
