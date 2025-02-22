import { Business } from './organization.model';

describe('Business', () => {
  it('should be defined', () => {
    expect(new Business()).toBeDefined();
  });
});
