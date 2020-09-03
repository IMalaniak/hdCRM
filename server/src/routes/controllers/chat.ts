import { Controller, Middleware, Get } from '@overnightjs/core';
import { Response } from 'express';
import { Logger } from '@overnightjs/logger';
import Passport from '@/config/passport';

@Controller('chats/')
export class ChatController {
  @Get('')
  @Middleware([Passport.authenticate()])
  getList(_, res: Response) {
    Logger.Info(`Selecting all messeges...`);
    // TEST
    res.json([]);
  }
}
