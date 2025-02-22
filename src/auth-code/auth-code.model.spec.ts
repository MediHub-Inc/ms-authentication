import { AuthCode } from './auth-code.model';

describe('AuthCode', () => {
  it('should be defined', () => {
    expect(
      new AuthCode({
        userId: '',
        code: '',
        token: '',
        idToken: '',
        refreshToken: '',
      }),
    ).toBeDefined();
  });
});
