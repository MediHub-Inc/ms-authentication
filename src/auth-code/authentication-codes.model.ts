import { BaseModel } from '../utils/shared/model/base.model';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { AuthtenticationCodesType } from 'src/utils/types/authentication-codes.type';
import { User } from 'src/user/user.model';

@Entity()
export class AuthenticationCodes extends BaseModel {
  @PrimaryColumn({ length: 255 })
  id: string;

  @Column({ type: 'longtext', nullable: true })
  code: string;

  @Column({ type: 'longtext', nullable: true })
  token: string;

  @Column({ type: 'int', nullable: true })
  userId: number;

  @Column({ type: 'longtext', nullable: true })
  idToken: string;

  @Column({ type: 'longtext', nullable: true })
  refreshToken: string;

  @ManyToOne(() => User, {
    cascade: true,
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user: User;

  constructor(authenticationCodes: AuthtenticationCodesType) {
    super();
    Object.assign(this, authenticationCodes);
  }
}
