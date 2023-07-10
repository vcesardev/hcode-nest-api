import { SetMetadata } from '@nestjs/common';
import { Role } from '../types/User';
import { ROLES_KEY } from '../utils';

export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
