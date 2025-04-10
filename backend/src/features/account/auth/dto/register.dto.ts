import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';
import { Index } from 'typeorm';

export class CheckEmailDto {
  @ApiProperty()
  @IsString()
  email: string;
}
export class RegisterDto {
  @ApiProperty({ example: 'John ', description: 'First name' })
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ example: 'Doe ', description: 'Last name' })
  @IsOptional()
  lastName: string;

  @ApiProperty({ example: 'user@example.com', description: 'User email' })
  @Index()
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password123!', description: 'User password' })
  @IsNotEmpty()
  @MinLength(8)
  @Matches(
    // Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    {
      message: 'Password too weak',
    },
  )
  password: string;

  @ApiProperty()
  @Exclude()
  token: string;

  @ApiProperty()
  @Exclude()
  roles: string[];
}
