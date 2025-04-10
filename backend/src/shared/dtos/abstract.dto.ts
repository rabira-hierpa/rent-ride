import { Exclude } from 'class-transformer';
import {
  BaseEntity,
  CreateDateColumn,
  DeleteDateColumn,
  ObjectIdColumn,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

export abstract class AbstractEntity extends BaseEntity {
  @ObjectIdColumn({ name: '_id' })
  @Exclude()
  _id: string;

  @PrimaryColumn()
  @ObjectIdColumn()
  id: string;

  @CreateDateColumn({ type: 'timestamptz' })
  created: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated: Date;

  @DeleteDateColumn({ type: 'timestamptz' })
  deleted: Date;
}
