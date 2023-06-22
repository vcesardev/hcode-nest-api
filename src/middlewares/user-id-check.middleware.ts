import {
  BadRequestException,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class UserIdCheckMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    if (Number(req.params.id) <= 0 || isNaN(Number(req.params.id))) {
      throw new BadRequestException('id is invalid.');
    }

    next();
  }
}
