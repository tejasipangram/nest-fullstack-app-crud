// file-type.decorator.ts
import {
  createParamDecorator,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { extname } from 'path';

export const FileType = createParamDecorator(
  (allowedTypes: string[], ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    const file = request.file;
    if (!file) {
      throw new HttpException('Please provide file', HttpStatus.BAD_REQUEST);
    } else {
      const fileType = extname(file.originalname);

      if (fileType !== '.jpg' && fileType !== '.png') {
        throw new HttpException(
          'Invalid file type. Allowed types are: ' + allowedTypes.join(', '),
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    return file;
  },
);

export const FileUpdateType = createParamDecorator(
  (allowedTypes: string[], ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    if (!request.file) {
      return undefined;
    }
    const file = request.file;
    const fileType = extname(file.originalname);

    if (fileType !== '.jpg' && fileType !== '.png') {
      //deleting that file

      throw new HttpException(
        'Invalid file type. Allowed types are: ' + allowedTypes.join(', '),
        HttpStatus.BAD_REQUEST,
      );
    }
    return file;
  },
);
