import { User } from './user.schema';

describe.skip('User', () => {
  it('should be defined', () => {
    expect(new User()).toBeDefined();
  });
});
