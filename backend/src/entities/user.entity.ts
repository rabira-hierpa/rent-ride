import { ApiProperty } from '@nestjs/swagger';
import * as bcrypt from 'bcrypt';
import { Exclude, Expose } from 'class-transformer';
import { AbstractEntity } from 'src/shared/dtos/abstract.dto';
import { BeforeInsert, Column, Entity } from 'typeorm';

@Entity()
export class UserEntity extends AbstractEntity {
  @ApiProperty()
  @Column()
  firstName: string;

  @Column()
  @ApiProperty()
  lastName: string;

  @ApiProperty()
  @Column({ unique: true })
  email: string;

  @ApiProperty()
  @Column()
  password: string;

  @ApiProperty()
  @Column({ nullable: true })
  @Exclude()
  token: string;

  @ApiProperty()
  @Column()
  roles: string[];

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  async comparePassword(attempt: string) {
    return await bcrypt.compare(attempt, this.password);
  }

  @Expose()
  get fullName(): string {
    return (
      [this.firstName, this.lastName].filter((name) => name).join(' ') ||
      this.firstName
    );
  }
}
