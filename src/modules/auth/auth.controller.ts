import {
  BadRequestException,
  Body,
  Controller,
  FileTypeValidator,
  Headers,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  Request,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthLoginDTO } from './dtos/IAuthLogin.dto';
import { AuthRegisterDTO } from './dtos/IAuthRegister.dto';
import { AuthForgetDTO } from './dtos/IAuthForget.dto';
import { AuthResetDTO } from './dtos/IAuthReset.dto';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { AuthGuard } from '../../guards/auth/auth.guard';
import { UserDecorator } from '../../decorators/user.decorator';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { User } from '../../types/User';
import { FilesService } from '../files/files.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly fileService: FilesService,
  ) {}

  @Post('login')
  async login(@Body() data: AuthLoginDTO) {
    const { email, password } = data;
    return this.authService.login(email, password);
  }

  @Post('register')
  async register(@Body() data: AuthRegisterDTO) {
    return this.authService.register(data);
  }

  @Post('forget')
  async forget(@Body() data: AuthForgetDTO) {
    const { email } = data;
    return this.authService.forget(email);
  }

  @Post('reset')
  async reset(@Body() data: AuthResetDTO) {
    const { password, token } = data;
    return this.authService.reset(password, token);
  }

  @UseGuards(AuthGuard)
  @Post('check')
  async check(@UserDecorator('email') user) {
    return { user: user };
  }

  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(AuthGuard)
  @Post('photo')
  async uploadPhoto(
    @UserDecorator('') user: User,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: 'image/png' }),
          new MaxFileSizeValidator({ maxSize: 1024 * 20 }),
        ],
      }),
    )
    photo: Express.Multer.File,
  ) {
    try {
      await this.fileService.uploadPhoto(photo, user);
    } catch (err) {
      throw new BadRequestException("Photo wasn't uploaded.");
    }

    return true;
  }
}
