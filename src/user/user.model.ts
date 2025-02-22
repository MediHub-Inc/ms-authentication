/* eslint-disable @typescript-eslint/no-unused-vars */
import { Organization } from '../organization/organization.model';
import { UserRole as UserRoleEnum } from '../utils/enums/user-role.enum';
import { UserStatus } from '../utils/enums/user-status.enum';
import { BaseModel } from '../utils/shared/model/base.model';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User extends BaseModel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => Organization, {
    cascade: true,
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  organization: Organization;

  @Column({ length: 25 })
  firstName: string;

  @Column({ length: 25 })
  familyName: string;

  @Column({ length: 25, nullable: true })
  middleName: string;

  @Column({
    type: 'enum',
    enum: UserRoleEnum,
    default: UserRoleEnum.PATIENT,
  })
  role: UserRoleEnum;

  @Column({ length: 25 })
  email: string;

  @Column({ length: 120, nullable: true })
  avatar: string;

  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.ACTIVE,
  })
  status: UserStatus;

  constructor(user: User) {
    super();
    Object.assign(this, user);
  }
}
