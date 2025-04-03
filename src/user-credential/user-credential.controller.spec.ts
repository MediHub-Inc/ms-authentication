import { Test, TestingModule } from '@nestjs/testing';
import { UserCredentialController } from './user-credential.controller';

describe.skip('UserCredentialController', () => {
  let controller: UserCredentialController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserCredentialController],
    }).compile();

    controller = module.get<UserCredentialController>(UserCredentialController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
