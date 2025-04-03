import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { randomBytes } from 'crypto';
import * as bcrypt from 'bcrypt';

import { AuthenticationCode } from './authentication-code.schema';
import { UserCredential } from '../user-credential/user-credential.schema';
import { User } from '../user/user.schema';
import { SignUpDto } from './dto/signup.dto';
import { Organization } from '../organization/organization.schema';
import { UserStatus } from '../utils/enums/user-status.enum';
import { UserRole } from '../user-role/user-role.schema';
import { AuthenticateDto } from './dto/authenticate.dto';

@Injectable()
export class AuthenticationService {
  constructor(
    @InjectModel(AuthenticationCode.name)
    private authenticationModel: Model<AuthenticationCode>,

    @InjectModel(UserCredential.name)
    private userCredentialModel: Model<UserCredential>,

    @InjectModel(User.name)
    private userModel: Model<User>,

    @InjectModel(Organization.name)
    private organizationModel: Model<Organization>,

    @InjectModel(UserRole.name)
    private roleModel: Model<UserRole>,
  ) {}

  async authenticate(authenticateDto: AuthenticateDto) {
    const { username, email, password } = authenticateDto;

    const nonDisabledUser = await this.userCredentialModel
      .findOne({
        $or: [{ username }, { email }],
      })
      .populate<{ user: User }>('user');

    if (
      !nonDisabledUser ||
      !nonDisabledUser.user ||
      nonDisabledUser.user.status !== UserStatus.ACTIVE
    ) {
      throw new NotFoundException(
        `User with username ${username} not found or inactive`,
      );
    }

    const passwordMatch = await bcrypt.compare(
      password,
      nonDisabledUser.passwordHash,
    );

    if (!passwordMatch) {
      throw new NotFoundException('Invalid username or password');
    }

    const code = randomBytes(32).toString('hex');
    const authenticationCode = new this.authenticationModel({
      user: nonDisabledUser.user._id,
      code,
      grantType: 'authentication',
    });

    await authenticationCode.save();

    return { authenticationCode: code, grantType: 'authentication' };
  }

  async signup(
    signupDto: SignUpDto,
  ): Promise<{ message: string; data: UserCredential }> {
    const { username, email, password } = signupDto;

    // Verificar existencia por username
    const existingUser = await this.userCredentialModel.findOne({ username });
    if (existingUser) {
      throw new ConflictException('Username already taken');
    }

    // Verificar existencia por email
    if (email) {
      const existingEmail = await this.userCredentialModel.findOne({ email });
      if (existingEmail) {
        throw new ConflictException('Email already registered');
      }
    }

    // Validar organización
    const organization = await this.organizationModel.findById(
      signupDto.organizationId,
    );
    if (!organization) {
      throw new NotFoundException('Organization not found');
    }

    // Validar rol
    const role = await this.roleModel.findById(signupDto.role);
    if (!role) {
      throw new NotFoundException('Role not found');
    }

    // Hashear contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear usuario
    const user = await this.userModel.create({
      firstName: signupDto.firstName,
      familyName: signupDto.familyName,
      middleName: signupDto.middleName,
      avatar: signupDto.avatar,
      status: signupDto.status || UserStatus.ACTIVE,
      organizationId: organization._id,
      roleId: role._id,
    });

    // Crear credenciales del usuario
    const userCredential = await this.userCredentialModel.create({
      username,
      email,
      passwordHash: hashedPassword,
      user: user._id,
    });

    return {
      message: 'User registered successfully',
      data: userCredential,
    };
  }
}
