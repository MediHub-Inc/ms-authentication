import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';
import { AuthenticationCode } from './authentication.model';
import { UserCredential } from '../user-credential/user-credential.model';
import { User } from '../user/user.model';
import { Organization } from '../organization/organization.model';
import { UserRole } from '../user-role/user-role.model';

describe.skip('AuthenticationController', () => {
  let controller: AuthenticationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthenticationController],
      providers: [
        AuthenticationService,

        // Mock de repositorios usando getRepositoryToken
        {
          provide: getRepositoryToken(AuthenticationCode),
          useValue: {},
        },
        {
          provide: getRepositoryToken(UserCredential),
          useValue: {},
        },
        {
          provide: getRepositoryToken(User),
          useValue: {},
        },
        {
          provide: getRepositoryToken(Organization),
          useValue: {},
        },
        {
          provide: getRepositoryToken(UserRole),
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<AuthenticationController>(AuthenticationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
