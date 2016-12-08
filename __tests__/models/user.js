import { User } from '../../index';

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
});
