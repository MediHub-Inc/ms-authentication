import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { UserRole as UserRoleEnum } from '../utils/enums/user-role.enum';
import { BaseModel } from '../utils/shared/model/base.model';
import { UserPermission } from '../user-permission/user-permission.model';
import { ManyToMany, JoinTable, OneToMany } from 'typeorm';
import { User } from '../user/user.model';

@Entity()
export class UserRole extends BaseModel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: UserRoleEnum,
  })
  name: UserRoleEnum;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'boolean', nullable: true })
  isActive: boolean;

  @ManyToMany(() => UserPermission, (permission) => permission.roles)
  @JoinTable({
    name: 'user_role_permissions',
    joinColumn: {
      name: 'user_role_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'user_permission_id',
      referencedColumnName: 'id',
    },
  })
  permissions: UserPermission[];

  @OneToMany(() => User, (user) => user.role)
  users: User[];

  constructor(userRole: Partial<UserRole>) {
    super();
    Object.assign(this, userRole);
  }
}
