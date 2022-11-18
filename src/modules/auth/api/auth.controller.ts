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
    const tokens = await this.authService.login(dto, device);
    res.cookie('refreshToken', tokens.refreshToken, {
      maxAge: 20 * 1000,
      httpOnly: true,
      secure: true,
    });
    return {
      accessToken: tokens.accessToken,
    };
  }

  @HttpCode(200)
  @Post('refresh-token')
  async refreshTokenUser(
    @Req() req: Request,
    @GetCurrentUserRequestParams() device: DeviceInputModel,
    @Res({ passthrough: true }) res: Response,
  ) {
    const token = req.cookies.refreshToken;
    const tokens = await this.authService.refresh(token, device);
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
    await this.authService.getUserFromToken(token);
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
/*
[
  {
    deviceId: 'ddb73157-5c81-4a18-a53b-84c3c2b4db4b',
    ip: '127.0.0.1',
    lastActiveDate: '2022-11-17T07:26:04.000Z',
    title:
      'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36',
  },
  {
    deviceId: 'c1f82ace-9007-49bb-9260-8e0700927bd8',
    ip: '127.0.0.1',
    lastActiveDate: '2022-11-17T07:26:04.000Z',
    title:
      'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:105.0) Gecko/20100101 Firefox/103.0',
  },
  {
    deviceId: 'dd706cc3-7440-4807-9d17-102df7860f8a',
    ip: '127.0.0.1',
    lastActiveDate: '2022-11-17T07:26:05.000Z',
    title:
      'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36',
  },
  {
    deviceId: '1c71193a-fa72-4225-9f4e-9a5e3dca6c45',
    ip: '127.0.0.1',
    lastActiveDate: '2022-11-17T07:26:05.000Z',
    title:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 12_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.6 Safari/605.1.15',
  },
  {
    deviceId: '2276f788-0ca4-4194-add7-3698db416daf',
    ip: '127.0.0.1',
    lastActiveDate: '2022-11-17T07:26:10.000Z',
    title: 'axios/0.26.1',
  },
];*/