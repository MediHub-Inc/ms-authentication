import { Organization } from '../organization/organization.model';
import { UserRole as UserRoleEnum } from '../utils/enums/user-role.enum';
import { UserStatus } from '../utils/enums/user-status.enum';
import { BaseModel } from '../utils/shared/model/base.model';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User extends BaseModel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Organization, (organization) => organization.users, {
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
  middleName?: string;

  @Column({
    type: 'enum',
    enum: UserRoleEnum,
    default: UserRoleEnum.PATIENT,
  })
  role: UserRoleEnum;

  @Column({ length: 120, nullable: true })
  avatar?: string;

  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.ACTIVE,
  })
  status: UserStatus;
}
