import { NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

export class OtherMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log('OtherMiddleware: Hello');
    const { authorization } = req.headers;

    if (authorization) {
      req['user'] = {
        name: 'Eric',
        lastname: 'Vasconcelos',
        role: 'admin',
      };
    }

    res.setHeader('Header', 'Do middleware');

    next();

    console.log('OtherMiddleware: Bye');
  }
}
