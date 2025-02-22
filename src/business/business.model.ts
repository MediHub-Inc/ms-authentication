import { UserStatus } from '../utils/enums/user-status.enum';
import { BaseModel } from '../utils/shared/model/base.model';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Business extends BaseModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 120 })
  name: string;

  @Column({ type: 'bigint' })
  ruc: number;

  @Column({ length: 120, nullable: true })
  logo: string;

  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.ACTIVE,
  })
  status: UserStatus;
}
