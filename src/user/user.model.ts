import { UserRole } from '../user-role/user-role.model';
import { Organization } from '../organization/organization.model';
import { UserStatus } from '../utils/enums/user-status.enum';
import { BaseModel } from '../utils/shared/model/base.model';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User extends BaseModel {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Organization, (organization) => organization.users, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  organization!: Organization;

  @Column({ length: 25 })
  firstName!: string;

  @Column({ length: 25 })
  familyName!: string;

  @Column({ length: 25, nullable: true })
  middleName?: string;

  @ManyToOne(() => UserRole, (role) => role.users, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  role!: UserRole;

  @Column({ length: 120, nullable: true })
  avatar?: string;

  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.ACTIVE,
  })
  status!: UserStatus;
}
