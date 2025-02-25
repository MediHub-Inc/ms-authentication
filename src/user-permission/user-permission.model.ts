import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { BaseModel } from "../utils/shared/model/base.model";
import { UserRole } from "../user-role/user-role.model";

@Entity()
export class UserPermission extends BaseModel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ default: true })
  isActive: boolean;

  @ManyToMany(() => UserRole, (role) => role.permissions)
  roles: UserRole[];

  constructor(userPermission: Partial<UserPermission>) {
    super();
    Object.assign(this, userPermission);
  }
}
