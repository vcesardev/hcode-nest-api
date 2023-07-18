import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { MailerService } from '@nestjs-modules/mailer/dist';

import { PrismaService } from '../../prisma/prisma.service';
import { AuthRegisterDTO } from './dtos/IAuthRegister.dto';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
    private readonly mailer: MailerService,
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

  checkResetToken(token: string) {
    try {
      const data = this.jwtService.verify(token, {
        audience: 'users',
        issuer: 'forget',
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

    const token = this.jwtService.sign(
      {
        email: user.email,
      },
      {
        expiresIn: '30 minutes',
        subject: String(user.id),
        issuer: 'forget',
        audience: 'users',
      },
    );

    await this.mailer.sendMail({
      subject: 'Recuperação de senha',
      to: 'vitorcesar261@gmail.com',
      template: 'forget',
      context: {
        name: user.name,
        token: token,
      },
    });

    return true;
  }

  async reset(password: string, token: string) {
    const data = await this.checkResetToken(token);

    const id = Number(data.sub);

    const salt = 10;

    password = await bcrypt.hash(password, salt);

    const user = await this.prisma.user.update({
      where: { id },
      data: { password: password },
    });

    return this.createToken(user);
  }

  async register(data: AuthRegisterDTO) {
    const user = await this.userService.create(data);
    return this.createToken(user);
  }
}
