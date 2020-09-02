import { OK, BAD_REQUEST } from 'http-status-codes';
import { Controller, Middleware, Get } from '@overnightjs/core';
import { Request, Response } from 'express';
import { Logger } from '@overnightjs/logger';
import * as db from '../../models';
import Passport from '../../config/passport';

@Controller('chats/')
export class ChatController {
  @Get('')
  @Middleware([Passport.authenticate()])
  private getList(req: Request, res: Response) {
    Logger.Info(`Selecting all messeges...`);
    // TEST
    res.json([]);
  }
}
