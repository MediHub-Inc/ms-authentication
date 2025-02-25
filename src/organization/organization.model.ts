import { BaseModel } from '../utils/shared/model/base.model';
import { User } from '../user/user.model';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Organization extends BaseModel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 120 })
  name: string;

  @Column({ type: 'varchar', length: 11, unique: true })
  ruc: string;

  @Column({ length: 120, nullable: true })
  logo?: string;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => User, (user) => user.organization)
  users: User[];
}
