import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  UseGuards,
} from '@nestjs/common';

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

@Controller('auth')
export class AuthController {
  constructor(
    private readonly tokensService: TokensService,
    private readonly authService: AuthService,
  ) {}

  @HttpCode(200)
  @Post('login')
  async loginUser(
    @Body() dto: LoginInputModel,
  ): Promise<LoginSuccessViewModel> {
    const user = await this.authService.checkCredentials(dto);
    if (user) {
      const tokens = await this.tokensService.createJWT(user);
      return {
        accessToken: tokens.accessToken,
      };
    }
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
