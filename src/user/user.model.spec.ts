import { User } from './user.model';

describe.skip('User', () => {
  it('should be defined', () => {
    expect(new User()).toBeDefined();
  });
});
