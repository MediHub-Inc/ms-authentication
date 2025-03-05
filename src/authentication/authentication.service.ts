/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { randomBytes } from 'crypto';
import { AuthenticationCode } from './authentication.model';
import { UserCredential } from '../user-credential/user-credential.model';
import { User } from '../user/user.model';
import { SignUpDto } from './dto/signup.dto';
import * as bcrypt from 'bcrypt';
import { Organization } from '../organization/organization.model';
import { UserStatus } from '../utils/enums/user-status.enum';
import { UserRole } from '../user-role/user-role.model';
import { AuthenticateDto } from './dto/authenticate.dto';
@Injectable()
export class AuthenticationService {
  constructor(
    @InjectRepository(AuthenticationCode)
    private authenticationRepository: Repository<AuthenticationCode>,
    @InjectRepository(UserCredential)
    private userCredentialRepository: Repository<UserCredential>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Organization)
    private organizationRepository: Repository<Organization>,
    @InjectRepository(UserRole)
    private roleRepository: Repository<UserRole>,
  ) {}

  async authenticate(authenticateDto: AuthenticateDto) {
    const { username, email, password } = authenticateDto;
    const nonDisabledUser = await this.userCredentialRepository.findOne({
      where: [
        { username, user: { status: UserStatus.ACTIVE } }, // Si coincide el username
        { email, user: { status: UserStatus.ACTIVE } }, // O si coincide el email
      ],
      relations: ['user'],
    });

    if (!nonDisabledUser)
      throw new NotFoundException(`User with username ${username} not found!`);

    const passwordMatch = await bcrypt.compare(
      password,
      nonDisabledUser.passwordHash,
    );

    console.log('nonDisabledUser: ', !nonDisabledUser || !passwordMatch);

    if (!nonDisabledUser || !passwordMatch) {
      throw new NotFoundException('Invalid username or password');
    }

    const code = randomBytes(32).toString('hex');
    const authenticationCode = this.authenticationRepository.create({
      user: nonDisabledUser.user,
      code,
      grantType: 'authentication',
    });

    await this.authenticationRepository.save(authenticationCode);

    return { authenticationCode: code, grantType: 'authentication' };
  }

  async signup(
    signupDto: SignUpDto,
  ): Promise<{ message: string; data: UserCredential }> {
    const { username, email, password } = signupDto;

    // Validar si el usuario ya existe
    const existingUser = await this.userCredentialRepository.findOne({
      where: { username },
    });
    if (existingUser) throw new ConflictException('Username already taken');

    if (email) {
      const existingEmail = await this.userCredentialRepository.findOne({
        where: { email },
      });
      if (existingEmail)
        throw new ConflictException('Email already registered');
    }

    // Hashear contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const organization = await this.organizationRepository.findOne({
      where: { id: signupDto.organizationId },
    });
    if (!organization) throw new NotFoundException('Organization not found');

    const role = await this.roleRepository.findOne({
      where: { id: signupDto.role },
    });
    if (!role) throw new NotFoundException('Role not found');

    // Create user
    const user = this.userRepository.create({
      firstName: signupDto.firstName,
      familyName: signupDto.familyName,
      middleName: signupDto.middleName,
      avatar: signupDto.avatar,
      status: signupDto.status,
      organization,
      role: role,
    });

    // Crear usuario creds
    const userCredential = this.userCredentialRepository.create({
      username,
      email,
      passwordHash: hashedPassword,
      user,
    });

    const createdUserCredential =
      await this.userCredentialRepository.save(userCredential);

    return {
      message: 'User registered successfully',
      data: {
        ...createdUserCredential,
      },
    };
  }
}
