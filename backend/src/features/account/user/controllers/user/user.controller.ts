import {
  BadRequestException,
  Controller,
  Get,
  Inject,
  UseGuards,
} from '@nestjs/common';
import { Auth } from 'src/features/account/auth/decorators/auth.decorator';
import { AllowedRoles } from 'src/features/account/auth/enums/allowedRoles.enum';
import { JwtAuthGuard } from 'src/features/account/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/features/account/auth/guards/roles.guard';
import { userToUserDecodeDto } from 'src/shared/helper/class-transformer';
import { User } from '../../decorators/user.decorator';
import { UserService } from '../../services/user.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('user')
export class UserController {
  constructor(
    @Inject(UserService)
    private readonly userService,
  ) {}

  @Get('getCurrentUser')
  async GetCurrentUser(@User() user) {
    try {
      const _user = await this.userService.findByEmail(user.email);
      return userToUserDecodeDto(_user);
    } catch (ex) {
      return new BadRequestException(ex);
    }
  }

  @Get('getAllUsers')
  @Auth(AllowedRoles.ADMIN)
  async GetAllUsers() {
    try {
      const users = await this.userService.findAll();
      return users.map((user) => userToUserDecodeDto(user));
    } catch (ex) {
      return new BadRequestException(ex);
    }
  }
}
