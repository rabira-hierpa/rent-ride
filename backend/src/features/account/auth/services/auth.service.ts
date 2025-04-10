import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { passwordStrength } from 'check-password-strength';
import * as crypto from 'crypto';
import * as jwt from 'jsonwebtoken';
import { UserEntity } from 'src/entities/user.entity';
import { WinstonLoggerService } from 'src/logger/service/logger.service';
import { userToUserDecodeDto } from 'src/shared/helper/class-transformer';
import {
  createAccessToken,
  createRefreshToken,
} from 'src/shared/helper/jwt.healper';
import { Repository } from 'typeorm';
import { UserDecodeDto } from '../../user/dtos/user.dto';
import { UserService } from '../../user/services/user.service';
import { LoginDto } from '../dto/login.dto';
import { RegisterDto } from '../dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity) private userRepo: Repository<UserEntity>,
    private readonly userService: UserService,
    private readonly logger: WinstonLoggerService,
  ) {}
  private generateToken() {
    return crypto.randomBytes(20).toString('hex');
  }

  async validateRefreshToken(refreshToken: string) {
    try {
      return jwt.verify(refreshToken, process.env.SECRET_KEY);
    } catch (ex) {
      throw new BadRequestException(ex.message);
    }
  }

  async validateUserToken(payload: UserEntity): Promise<UserEntity> {
    return await this.userRepo.findOne({ where: { id: payload.id } });
  }

  async validateUser(
    email: string,
    password: string,
  ): Promise<UserEntity | null> {
    const user = await this.userService.findByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    return null;
  }

  async login(credentials: LoginDto) {
    const user = await this.userRepo.findOne({
      where: { email: credentials.email.toLowerCase() },
    });
    if (!user) {
      throw new BadRequestException('User does not exist');
    }
    const isValid = await user.comparePassword(credentials.password);
    if (!isValid) {
      throw new BadRequestException('Invalid username or password');
    }

    const userData = userToUserDecodeDto(user);
    const accessToken = createAccessToken(userData);
    const refreshToken = createRefreshToken(userData);

    user.token = accessToken.accessToken;
    this.logger.log(`${user.email} logged in successfully`);
    return {
      user: { ...userToUserDecodeDto(user) },
      accessToken,
      refreshToken,
    };
  }

  async register(userDto: RegisterDto): Promise<UserDecodeDto> {
    //check if user with this email already exists
    const existingUser = await this.userService.findByEmail(userDto.email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }
    if (userDto.password.length < 8) {
      //check password
      throw new BadRequestException(
        'password must be longer than or equal to 8 characters',
      );
    }
    //TODO: Apply the password policy
    if (passwordStrength(userDto.password).id < 2) {
      throw new BadRequestException('Password too weak');
    }

    userDto.email = userDto.email.toLowerCase();

    const token = this.generateToken();
    userDto.token = token;
    userDto.roles = ['user'];

    // Register the user
    const user = await this.userRepo.save(this.userRepo.create(userDto));
    this.logger.log(`${user.email} registered successfully`);
    return userToUserDecodeDto(user);
  }
}
