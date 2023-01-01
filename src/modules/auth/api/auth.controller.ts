import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';

//Decorators
import { GetCurrentUser } from '../../../common/decorators/get-current-user.decorator';

//DTO
import { MeViewModel, LoginSuccessViewModel } from '../application/dto';

//Models
import {
  LoginInputModel,
  NewPasswordRecoveryInputModel,
  PasswordRecoveryInputModel,
  RegistrationConfirmationCodeModel,
  RegistrationEmailResending,
} from './models';

//Models - users
import { UserInputModel } from '../../../modules/users/api/models';

//Decorators
import { GetCurrentUserDevice } from '../../../common/decorators/get-current-user-device.decorator';
//Model
import { DeviceInputModel } from '../../../modules/security-devices/api/models/security-devices.model';
import {
  UserLoginCommand,
  UserLogoutCommand,
  UserRegistrationCommand,
  UserRegistrationConfirmationCommand,
  UserRegistrationEmailResendingCommand,
  PasswordNewCommand,
  PasswordRecoveryCommand,
} from '../application/useCases';
import { Public } from '../../../common/decorators/public.decorator';
import { AuthQueryRepository } from './queryRepository/auth.query.repository';
import { CommandBus } from '@nestjs/cqrs';
import { ConfigService } from '@nestjs/config';
import { JwtAuthRefreshGuard } from '../../../common/guards/jwt-auth.refresh.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly configService: ConfigService,
    private readonly commandBus: CommandBus,
    private readonly authQueryRepository: AuthQueryRepository,
  ) {}

  private async buildResponseNewTokens(
    res: Response,
    device: DeviceInputModel,
  ): Promise<LoginSuccessViewModel> {
    const tokens = await this.commandBus.execute(new UserLoginCommand(device));
    res.cookie('refreshToken', tokens.refreshToken, {
      maxAge: +this.configService.get<string>('RT_TIME') * 1000,
      httpOnly: true,
      secure: true,
    });
    return {
      accessToken: tokens.accessToken,
    };
  }

  @Public()
  @HttpCode(200)
  @Post('login')
  async loginUser(
    @Res({ passthrough: true }) res: Response,
    @GetCurrentUserDevice() device: DeviceInputModel,
    @Body()
    inputModel: LoginInputModel,
  ): Promise<LoginSuccessViewModel> {
    const user = await this.authQueryRepository.checkCredentials(inputModel);
    return this.buildResponseNewTokens(res, { ...device, ...user });
  }

  @Public()
  @UseGuards(JwtAuthRefreshGuard)
  @HttpCode(200)
  @Post('refresh-token')
  async refreshTokenUser(
    @Res({ passthrough: true }) res: Response,
    @GetCurrentUserDevice() device: DeviceInputModel,
  ): Promise<LoginSuccessViewModel> {
    return this.buildResponseNewTokens(res, device);
  }

  @Public()
  @UseGuards(JwtAuthRefreshGuard)
  @HttpCode(204)
  @Post('logout')
  async logoutUser(
    @GetCurrentUserDevice() device: DeviceInputModel,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.commandBus.execute(new UserLogoutCommand(device));
    res.clearCookie('refreshToken');
  }

  @Public()
  @HttpCode(204)
  @Post('registration')
  async registrationUser(@Body() dto: UserInputModel) {
    await this.commandBus.execute(new UserRegistrationCommand(dto));
  }

  @Public()
  @HttpCode(204)
  @Post('registration-confirmation')
  async registrationConfirmationUser(
    @Body() { code }: RegistrationConfirmationCodeModel,
  ) {
    await this.commandBus.execute(
      new UserRegistrationConfirmationCommand(code),
    );
  }

  @Public()
  @HttpCode(204)
  @Post('registration-email-resending')
  async registrationEmailResendingUser(
    @Body() { email }: RegistrationEmailResending,
  ) {
    await this.commandBus.execute(
      new UserRegistrationEmailResendingCommand(email),
    );
  }

  @Public()
  @HttpCode(204)
  @Post('new-password')
  async newPassword(
    @Body() { newPassword, recoveryCode }: NewPasswordRecoveryInputModel,
  ) {
    await this.commandBus.execute(
      new PasswordNewCommand(newPassword, recoveryCode),
    );
  }

  @Public()
  @HttpCode(204)
  @Post('password-recovery')
  async passwordRecovery(@Body() { email }: PasswordRecoveryInputModel) {
    await this.commandBus.execute(new PasswordRecoveryCommand(email));
  }

  @Get('me')
  getMe(@GetCurrentUser() user: MeViewModel): MeViewModel {
    return user;
  }
}
