import * as models from '../index';

describe('Index', () => {
  it('should export sequelize', () => {
    expect(models.sequelize).toBeDefined();
    expect(models.Sequelize).toBeDefined();
  });
});
