import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compareHash, generateHash } from './utils/handleBcrypt';
import { LoginAuthDto } from './dto/login-auth.dto';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UsersService,
  ) {}

  public async login(userLoginBody: LoginAuthDto) {
    const { email, password } = userLoginBody;

    const userExist = await this.userService.getUserByEmail(email);
    if (!userExist)
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    const isCheck = await compareHash(password, userExist.password);
    if (!isCheck)
      throw new HttpException('Password invalid', HttpStatus.CONFLICT);

    const payload = {
      id: userExist.id,
      email: userExist.email,
    };

    const token = this.jwtService.sign(payload);

    const data = {
      user: userExist,
      token,
    };

    return data;
  }

  public async register(userBody: RegisterAuthDto) {
    const { password, ...user } = userBody;

    const userParse = {
      ...user,
      password: await generateHash(password),
    };
    const newUser = await this.userService.createUser(userParse);

    return newUser;
  }
}
