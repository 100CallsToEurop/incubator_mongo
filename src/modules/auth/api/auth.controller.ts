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
import { TokensService } from '../../../modules/tokens/application/tokens.service';

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
import { Types } from 'mongoose';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly tokensService: TokensService,
    private readonly authService: AuthService,
  ) {}

  @HttpCode(200)
  @Post('login')
  async loginUser(
    @Res({ passthrough: true }) res: Response,
    @Body() dto: LoginInputModel,
  ): Promise<LoginSuccessViewModel> {
    const user = await this.authService.checkCredentials(dto);
    if (user) {
      const tokens = await this.tokensService.createJWT(user);
      await this.tokensService.setRefreshTokenUser(
        new Types.ObjectId(user.userId),
        tokens.refreshToken,
      );
      res.cookie('refreshToken', tokens.refreshToken, {
        maxAge: 20 * 1000,
        httpOnly: true,
       // secure: true,
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
    @Res({ passthrough: true }) res: Response,
  ) {
    const token = req.cookies.refreshToken;
    await this.tokensService.decodeToken(token);
    const user = await this.tokensService.getUserIdByToken(token);
    await this.tokensService.createInvalidToken(token);
    const tokens = await this.tokensService.createJWT(user);
    res.cookie('refreshToken', tokens.refreshToken, {
      maxAge: 20 * 1000,
      httpOnly: true,
     // secure: true,
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
    await this.tokensService.decodeToken(token);
    console.log(1)
    await this.tokensService.createInvalidToken(token);
    console.log(2);
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
    console.log(user);
    return user;
  }
}
