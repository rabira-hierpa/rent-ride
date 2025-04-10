import { IsArray, IsEmail, IsString } from 'class-validator';

export class UserDecodeDto {
  @IsString()
  id: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  fullName: string;

  @IsArray()
  roles: string[];
}
