import { CreateDateColumn, UpdateDateColumn } from 'typeorm';

export class BaseModel {
  @CreateDateColumn()
  createdAt!: string;

  @UpdateDateColumn()
  updatedAt!: string;
}
