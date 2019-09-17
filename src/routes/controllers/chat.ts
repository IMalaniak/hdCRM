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
        const messageList = [{
            id: 1,
            messages: [{
                id: 1,
                message: 'Hello World',
                recepientId: 1,
                senderId: 1,
            }, {
                id: 2,
                message: 'Hello World2',
                recepientId: 1,
                senderId: 1,
            }]
        },
        {
            id: 2,
            messages: [{
                id: 3,
                message: 'Hello Friend',
                recepientId: 2,
                senderId: 2,
            }]
        },
        {
            id: 3,
            messages: [{
                id: 4,
                message: 'Hello Bro',
                recepientId: 3,
                senderId: 3,
            }]
        }];
        res.json(messageList);
    }
}
