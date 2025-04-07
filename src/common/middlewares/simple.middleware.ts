import { NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

export class SimpleMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log('SimpleMiddleware: Hello');
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

    console.log('SimpleMiddleware: Bye');

    res.on('finish', () => {
      console.log('SimpleMiddleware: Finish');
    });
  }
}
