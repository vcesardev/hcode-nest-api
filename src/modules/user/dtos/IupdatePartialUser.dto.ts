import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDTO } from './IcreateUser.dto';

export class UpdatePartialUserDTO extends PartialType(CreateUserDTO) {}
