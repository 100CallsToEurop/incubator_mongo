import { Body, Controller, HttpCode, Post } from '@nestjs/common';

//Services
import { AuthService } from '../application/auth.service';

import { LoginInputModel } from './models';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(204)
  @Post('login')
  async loginUser(@Body() dto: LoginInputModel) {
    await this.authService.checkCredentials(dto);
  }
}
