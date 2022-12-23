import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { Request, Response } from 'express';

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
import { GetCurrentUserRequestParams } from '../../../common/decorators/get-current-user-request-params.decorator';
//Model
import { DeviceInputModel } from '../../../modules/security-devices/api/models/security-devices.model';
import {
  UserLoginCommand,
  RefreshTokensCommand,
  UserLogoutCommand,
  UserRegistrationCommand,
  UserRegistrationConfirmationCommand,
  UserRegistrationEmailResendingCommand,
  PasswordNewCommand,
  PasswordRecoveryCommand,
} from '../application/useCases';
import { Public } from 'src/common/decorators/public.decorator';
import { AuthQueryRepository } from './queryRepository/auth.query.repository';
import { CommandBus } from '@nestjs/cqrs';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly configService: ConfigService,
    private readonly commandBus: CommandBus,
    private readonly authQueryRepository: AuthQueryRepository,
  ) {}

  @Public()
  @HttpCode(200)
  @Post('login')
  async loginUser(
    @Res({ passthrough: true }) res: Response,
    @GetCurrentUserRequestParams() device: DeviceInputModel,
    @Body()
    inputModel: LoginInputModel,
  ): Promise<LoginSuccessViewModel> {
    const user = await this.authQueryRepository.checkCredentials(inputModel);
    const tokens = await this.commandBus.execute(
      new UserLoginCommand(user, device),
    );
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
  @Post('refresh-token')
  async refreshTokenUser(
    @Req() req: Request,
    @GetCurrentUserRequestParams() device: DeviceInputModel,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = req.cookies.refreshToken;
    await this.authQueryRepository.checkJWTToken(refreshToken);
    const tokens = await this.commandBus.execute(
      new RefreshTokensCommand(refreshToken, device),
    );
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
  @HttpCode(204)
  @Post('logout')
  async logoutUser(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = req.cookies.refreshToken;
    await this.authQueryRepository.checkJWTToken(refreshToken);
    await this.commandBus.execute(new UserLogoutCommand(refreshToken));
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
