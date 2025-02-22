import { User } from '../user/user.model';
import { BaseModel } from '../utils/shared/model/base.model';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class UserCredential extends BaseModel {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User, {
    cascade: true,
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user: User;

  @Column({ length: 25 })
  username: string;

  @Column({ length: 255 })
  passwordHash: string;

  @Column({ length: 255, nullable: true })
  passwordResetHash: string;

  @Column({ type: 'datetime', nullable: true })
  lastLogin: string;

  @Column({ type: 'datetime', nullable: true })
  passwordResetExpirationDate: string;

  constructor(userCredential: UserCredential) {
    super();
    Object.assign(this, userCredential);
  }
}
