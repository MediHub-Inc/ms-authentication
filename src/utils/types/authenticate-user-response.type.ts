import { UserRole } from '../enums/user-role.enum';

export type AuthenticateUserResponse = { code: string; role: UserRole };
