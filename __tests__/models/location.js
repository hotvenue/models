import { Location } from '../../index';

describe('Location', () => {
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
    console.log(Location.rawAttributes.name);
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
    console.log(Location.rawAttributes.geoLatitude);
  });
});
