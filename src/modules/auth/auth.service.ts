import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';

import { PrismaService } from '../../prisma/prisma.service';
import { AuthRegisterDTO } from './dtos/IAuthRegister.dto';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
  ) {}

  async createToken(user: User) {
    const accessToken = this.jwtService.sign(
      {
        email: user.email,
        name: user.name,
      },
      {
        expiresIn: '1 day',
        subject: String(user.id),
        issuer: 'login',
        audience: 'users',
      },
    );

    return { accessToken };
  }

  checkToken(token: string) {
    try {
      const data = this.jwtService.verify(token, {
        audience: 'users',
        issuer: 'login',
      });

      return data;
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  isValidToken(token: string) {
    try {
      this.checkToken(token);
      return true;
    } catch (e) {
      return false;
    }
  }

  async login(email: string, password: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (!user) {
      throw new UnauthorizedException('E-mail e/ou senha incorretos.');
    }

    const checkPassword = await bcrypt.compare(password, user.password);

    if (!checkPassword) {
      throw new UnauthorizedException('E-mail e/ou senha incorretos.');
    }

    delete user.password;

    const accessToken = await this.createToken(user);

    return { ...user, ...accessToken };
  }

  async forget(email: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (!user) {
      throw new UnauthorizedException('E-mail incorreto.');
    }

    //todo add envio de email

    return true;
  }

  async reset(password: string, token: string) {
    //todo validar token, através da validação será possível extrair o id do usuário

    const id = 0;

    const user = await this.prisma.user.update({
      where: { id },
      data: {
        password: password,
      },
    });

    return this.createToken(user);
  }

  async register(data: AuthRegisterDTO) {
    const user = await this.userService.create(data);
    return this.createToken(user);
  }
}
