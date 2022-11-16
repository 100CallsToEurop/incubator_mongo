import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import * as uuid from 'uuid';
import * as bcrypt from 'bcrypt';
import { Types } from 'mongoose';

//Models
import { LoginInputModel } from '../api/models';

//Models -users
import { UserInputModel } from '../../../modules/users/api/models';

//Service
import { EmailTemplatesManager } from '../../../modules/managers/application/managers.service';
import { TokensService } from '../../../modules/tokens/application/tokens.service';
import { SecurityDevicesService } from '../../../modules/security-devices/application/security-devices.service';

//DTO
import { MeViewModel } from './dto';

//Repository
import { UsersRepository } from '../../../modules/users/infrastructure/users.repository';

//Entity - users
import { UserEntity } from '../../../modules/users/domain/entity/user.entity';

//DTO - tokens
import { TokensViewModel } from '../../../modules/tokens/application/dto';

//Model - devices
import {
  DeviceInputModelPayload,
  DeviceInputModel,
} from 'src/modules/security-devices/api/models';

@Injectable()
export class AuthService {
  constructor(
    private readonly emailManager: EmailTemplatesManager,
    private readonly usersRepository: UsersRepository,
    private readonly tokensService: TokensService,
    private readonly securityDevicesService: SecurityDevicesService,
  ) {}

  async getNewTokens(
    user: MeViewModel,
    device: DeviceInputModel,
    refreshToken?: string,
  ): Promise<TokensViewModel> {
    const deviceId = refreshToken
      ? (await this.tokensService.decodeToken(refreshToken)).deviceId
      : uuid.v4();

    const tokens = await this.tokensService.createJWT(user, deviceId);
    await this.usersRepository.updateRefreshToken(
      new Types.ObjectId(user.userId),
      tokens.refreshToken,
    );

    const decodeNewRefreshToken = await this.tokensService.decodeToken(
      tokens.refreshToken,
    );

    const payload: DeviceInputModelPayload = {
      deviceId: decodeNewRefreshToken.deviceId,
      iat: decodeNewRefreshToken.iat,
      exp: decodeNewRefreshToken.exp,
    };

    await this.securityDevicesService.createDevice(
      device,
      payload,
      user.userId,
    );
    return tokens;
  }

  async createInvalidRefreshToken(token: string): Promise<MeViewModel> {
    await this.tokensService.decodeToken(token);
    const user = await this.usersRepository.findUserByRefreshToken(token);
    if (user) {
      await this.usersRepository.addInBadToken(token);
      return {
        userId: user._id.toString(),
        login: user.accountData.login,
        email: user.accountData.email,
      };
    }
    throw new UnauthorizedException();
  }

  async checkCredentials(loginParam: LoginInputModel): Promise<MeViewModel> {
    const user = await this.checkEmailOrLogin(loginParam.login);
    const isHashedEquals = await this._isPasswordCorrect(
      loginParam.password,
      user.accountData.passwordHash,
    );
    if (isHashedEquals)
      return {
        userId: user._id.toString(),
        email: user.accountData.email,
        login: user.accountData.login,
      };
    throw new UnauthorizedException();
  }

  async registration(newUserModel: UserInputModel) {
    await this.checkEmailOrLogin(newUserModel.email, true);
    await this.checkEmailOrLogin(newUserModel.login, true);

    const passwordHash = await this._generateHash(newUserModel.password);
    const newUserEntity = new UserEntity(newUserModel, passwordHash);
    const newUser = await this.usersRepository.createUser(newUserEntity);
    try {
      await this.emailManager.sendEmailConfirmationMessage(
        newUser.accountData.email,
        newUser.emailConfirmation.confirmationCode,
      );
      return newUser;
    } catch (err) {
      throw new InternalServerErrorException();
    }
  }

  async resendingEmail(email: string) {
    const user = await this.checkEmailOrLogin(email);
    if (user.emailConfirmation.isConfirmed) {
      throw new BadRequestException({
        message: ['email already activated'],
      });
    }
    const newCode = (user.emailConfirmation.confirmationCode = uuid.v4());
    await this.usersRepository.updateConfirmationCode(user._id, newCode);
    try {
      await this.emailManager.sendEmailConfirmationMessage(
        user.accountData.email,
        user.emailConfirmation.confirmationCode,
      );
      return newCode;
    } catch (err) {
      throw new InternalServerErrorException();
    }
  }

  async findUserForConfirm(code: string) {
    const user = await this.usersRepository.findByConfirmCode(code);
    if (!user) {
      throw new BadRequestException({
        message: ['code invalid'],
      });
    }
    if (
      user.emailConfirmation.isConfirmed ||
      user.emailConfirmation.confirmationCode !== code ||
      user.emailConfirmation.expirationDate < new Date()
    ) {
      throw new BadRequestException({
        message: ['code invalid'],
      });
    }

    return await this.usersRepository.updateConfirmationState(user._id);
  }

  async checkEmailOrLogin(emailOrLogin: string, isExist?: boolean) {
    let field = '';
    emailOrLogin.indexOf('@') > -1 ? (field = 'email') : (field = 'login');
    const checkUserEmailOrLogin =
      await this.usersRepository.findUserByEmailOrLogin(emailOrLogin);
    if (checkUserEmailOrLogin && isExist) {
      throw new BadRequestException({
        message: [`${field} already exists`],
      });
    }
    if (!checkUserEmailOrLogin && !isExist && field === 'email') {
      throw new BadRequestException({
        message: ['email incorrect'],
      });
    }

    if (!checkUserEmailOrLogin && !isExist && field === 'login') {
      throw new UnauthorizedException();
    }
    return checkUserEmailOrLogin;
  }

  async _generateHash(password: string) {
    const hash = await bcrypt.hash(password, 10);
    return hash;
  }

  async _isPasswordCorrect(password: string, hash: string) {
    const isEqual = await bcrypt.compare(password, hash);
    return isEqual;
  }
}
