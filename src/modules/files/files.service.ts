import { Injectable } from '@nestjs/common';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { User } from '../../types/User';

@Injectable()
export class FilesService {
  async uploadPhoto(photo: Express.Multer.File, user: User) {
    const result = await writeFile(
      join(
        __dirname,
        '..',
        '..',
        '..',
        'storage',
        'photos',
        `photo-${user.id}.png`,
      ),
      photo.buffer,
    );

    return result;
  }
}
