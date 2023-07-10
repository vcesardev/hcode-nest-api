import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  IsStrongPassword,
} from 'class-validator';
import { Role } from '../../../types/User';

export class CreateUserDTO {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsStrongPassword({
    minLength: 6,
    minLowercase: 0,
    minNumbers: 0,
    minSymbols: 1,
    minUppercase: 1,
  })
  password: string;

  createdAt: Date;

  updatedAt: Date;

  @IsOptional()
  @IsEnum(Role)
  role: number;
}
