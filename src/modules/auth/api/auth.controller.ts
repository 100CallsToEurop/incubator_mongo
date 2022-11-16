import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';

//Decorators
import { GetCurrentUser } from '../../../common/decorators/get-current-user.decorator';

//Guards
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';

//Services
import { AuthService } from '../application/auth.service';
//DTO
import { MeViewModel, LoginSuccessViewModel } from '../application/dto';

//Models
import {
  LoginInputModel,
  RegistrationConfirmationCodeModel,
  RegistrationEmailResending,
} from './models';

//Models - users
import { UserInputModel } from '../../../modules/users/api/models';

//Decorators
import { GetCurrentUserRequestParams } from '../../../common/decorators/get-current-user-request-params.decorator';
//Model
import { DeviceInputModel } from '../../../modules/security-devices/api/models/security-devices.model';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(200)
  @Post('login')
  async loginUser(
    @Res({ passthrough: true }) res: Response,
    @GetCurrentUserRequestParams() device: DeviceInputModel,
    @Body()
    dto: LoginInputModel,
  ): Promise<LoginSuccessViewModel> {
    const user = await this.authService.checkCredentials(dto);
    if (user) {
      const tokens = await this.authService.getNewTokens(user, device);
      res.cookie('refreshToken', tokens.refreshToken, {
        maxAge: 20 * 1000,
        httpOnly: true,
        secure: true,
      });
      return {
        accessToken: tokens.accessToken,
      };
    }
  }

  @HttpCode(200)
  @Post('refresh-token')
  async refreshTokenUser(
    @Req() req: Request,
    @GetCurrentUserRequestParams() device: DeviceInputModel,
    @Res({ passthrough: true }) res: Response,
  ) {
    const token = req.cookies.refreshToken;
    const user = await this.authService.createInvalidRefreshToken(token);
    const tokens = await this.authService.getNewTokens(user, device, token);
    res.cookie('refreshToken', tokens.refreshToken, {
      maxAge: 20 * 1000,
      httpOnly: true,
      secure: true,
    });
    return {
      accessToken: tokens.accessToken,
    };
  }

  @HttpCode(204)
  @Post('logout')
  async logoutUser(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const token = req.cookies.refreshToken;
    await this.authService.createInvalidRefreshToken(token);
    res.clearCookie('refreshToken');
  }

  @HttpCode(204)
  @Post('registration')
  async registrationUser(@Body() dto: UserInputModel) {
    await this.authService.registration(dto);
  }

  @HttpCode(204)
  @Post('registration-confirmation')
  async registrationConfirmationUser(
    @Body() { code }: RegistrationConfirmationCodeModel,
  ) {
    await this.authService.findUserForConfirm(code);
  }

  @HttpCode(204)
  @Post('registration-email-resending')
  async registrationEmailResendingUser(
    @Body() { email }: RegistrationEmailResending,
  ) {
    await this.authService.resendingEmail(email);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMe(@GetCurrentUser() user: MeViewModel): MeViewModel {
    return user;
  }
}
